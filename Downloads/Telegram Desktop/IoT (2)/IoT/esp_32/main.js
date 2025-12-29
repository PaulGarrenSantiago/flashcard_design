var wifi = require("Wifi");
var http = require("http");

var SSID = "Faallllyy";
var PASSWORD = "faalllyy";

wifi.connect(SSID, { password: PASSWORD }, function(err) {
  if (err) {
    console.log("Connection error:", err);
    return;
  }

  console.log("Connected to Wi-Fi");

  var ip = wifi.getIP();
  console.log("ESP32 IP Address:", ip.ip);

  // ✅ HTTP request ONLY after Wi-Fi is ready
  http.get("http://192.168.100.10:3000/esp32/ping", function (res) {
    res.on("data", function (data) {
      console.log("Server says:", data.toString());
    });
  });
});


function MFRC522(spi, cs, rst) {
  this.spi = spi;
  this.cs = cs;
  this.rst = rst;

  pinMode(this.cs, "output");
  digitalWrite(this.cs, 1);

  if (this.rst !== null) {
    pinMode(this.rst, "output");
    digitalWrite(this.rst, 1);
  }

  this.reset();
  this.init();
  this.antennaOn();
}

/* ===== SPI Low Level ===== */

MFRC522.prototype.write = function (addr, val) {
  digitalWrite(this.cs, 0);
  this.spi.send([ (addr << 1) & 0x7E, val ]);
  digitalWrite(this.cs, 1);
};

MFRC522.prototype.read = function (addr) {
  digitalWrite(this.cs, 0);
  var res = this.spi.send([ ((addr << 1) & 0x7E) | 0x80, 0 ]);
  digitalWrite(this.cs, 1);
  return res[1];
};

MFRC522.prototype.reset = function () {
  this.write(0x01, 0x0F);
};

MFRC522.prototype.init = function () {
  this.write(0x2A, 0x8D);
  this.write(0x2B, 0x3E);
  this.write(0x2D, 30);
  this.write(0x2C, 0);
  this.write(0x15, 0x40);
  this.write(0x11, 0x3D);
};

MFRC522.prototype.antennaOn = function () {
  var v = this.read(0x14);
  if ((v & 0x03) !== 0x03)
    this.write(0x14, v | 0x03);
};

MFRC522.prototype.command = function (cmd, data) {
  this.write(0x01, 0x00);
  this.write(0x0A, 0x80);

  for (var i = 0; i < data.length; i++)
    this.write(0x09, data[i]);

  this.write(0x01, cmd);

  if (cmd == 0x0C)
    this.write(0x0D, this.read(0x0D) | 0x80);

  var i = 2000, irq;
  do {
    irq = this.read(0x04);
    i--;
  } while (i && !(irq & 0x30));

  if (!i) return false;

  if (this.read(0x06) & 0x13)
    return false;

  var len = this.read(0x0A);
  var res = [];
  for (var j = 0; j < len; j++)
    res.push(this.read(0x09));

  return res;
};

MFRC522.prototype.request = function (mode) {
  this.write(0x0D, 0x07);
  var resp = this.command(0x0C, [mode]);
  return (resp && resp.length) ? resp : false;
};

MFRC522.prototype.anticoll = function () {
  this.write(0x0D, 0x00);
  var resp = this.command(0x0C, [0x93, 0x20]);
  return (resp && resp.length >= 5) ? resp.slice(0, 4) : false;
};

MFRC522.prototype.isCard = function () {
  return this.request(0x26) !== false;
};

MFRC522.prototype.getUID = function () {
  return this.anticoll();
};

/* =======================================================
   PIN SETUP
   ======================================================= */

var spi = new SPI();
spi.setup({
  mosi: D23,
  miso: D19,
  sck : D18,
  baud: 1000000
});

// Reader #1 pins
const CS1  = D16;
const RST1 = D22;

// Reader #2 pins
const CS2  = D5;
const RST2 = D21;

// Create 2 RFID instances
var rfid1 = new MFRC522(spi, CS1, RST1);
var rfid2 = new MFRC522(spi, CS2, RST2);

var busy = false;

var R1_GREEN = D33;
var R1_RED   = D32;

var R2_GREEN = D27;
var R2_RED   = D14;

/* ============================
   LED SETUP (PER READER)
   ============================ */
pinMode(R1_GREEN, "output");
pinMode(R1_RED,   "output");
pinMode(R2_GREEN, "output");
pinMode(R2_RED,   "output");

digitalWrite(R1_GREEN, 0);
digitalWrite(R1_RED,   0);
digitalWrite(R2_GREEN, 0);
digitalWrite(R2_RED,   0);

function reader1Granted() {
  digitalWrite(R1_GREEN, 1);
  setTimeout(function () {
    digitalWrite(R1_GREEN, 0);
  }, 800);
}

function reader1Denied() {
  digitalWrite(R1_RED, 1);
  setTimeout(function () {
    digitalWrite(R1_RED, 0);
  }, 800);
}

function reader2Granted() {
  digitalWrite(R2_GREEN, 1);
  setTimeout(function () {
    digitalWrite(R2_GREEN, 0);
  }, 800);
}

function reader2Denied() {
  digitalWrite(R2_RED, 1);
  setTimeout(function () {
    digitalWrite(R2_RED, 0);
  }, 800);
}

/* =======================================================
   CARD ASSIGNMENTS
   ======================================================= */

// FORMAT → lowercase hex with : separator
const CARD_1 = "23:45:b2:38";
const CARD_2 = "43:29:18:39";

const MASTER_1 = "f2:5c:bd:ab";
const MASTER_2 = "72:58:b8:ab";

function uidToHex(uid) {
  var s = "";
  for (var i = 0; i < uid.length; i++) {
    var h = uid[i].toString(16);
    if (h.length < 2) h = "0" + h;
    s += h;
    if (i < uid.length - 1) s += ":";
  }
  return s;
}


/* ============================
   RELAY SETUP
   ============================ */
const RELAY1 = D25;  // Relay IN1
const RELAY2 = D26; 

pinMode(RELAY1, "output");
digitalWrite(RELAY1, 1); // relay OFF at boot (active LOW relay)

pinMode(RELAY2, "output");
digitalWrite(RELAY2, 1);

/* ============================
   FUNCTION: Unlock Door
   ============================ */
function unlockDoor() {

  console.log("Unlocking door...");
  digitalWrite(RELAY1, 0);

  setTimeout(function () {
    digitalWrite(RELAY1, 1);
    busy = false;
    console.log("Door locked.");
  }, 3000);
}

function unlockDoor2() {
  
  console.log("Unlocking door 2...");
  digitalWrite(RELAY2, 0);
  
  setTimeout(function () {
    digitalWrite(RELAY2, 1);
    console.log("Door 2 locked.");
  }, 3000);
}


/* =======================================================
   MAIN LOOP
   ======================================================= */

setInterval(function () {

  /* ---------- READER 1 ---------- */
  if (rfid1.isCard()) {
    var uid = rfid1.getUID();
    if (uid) {
      var hex = uidToHex(uid);

      if (hex === CARD_1) {
        console.log("Reader 1 → Access Granted (Card 1)");
        reader1Granted();
        unlockDoor();

      } else if (hex === MASTER_1 || hex === MASTER_2) {
        console.log("Reader 1 → Master Card Detected → Access Granted");
        reader1Granted();
        unlockDoor();

      } else {
        console.log("Reader 1 → Access Denied:", hex);
        reader1Denied();
      }
    }
  }
  
  

  /* ---------- READER 2 ---------- */
  if (rfid2.isCard()) {
    var uid2 = rfid2.getUID();
    if (uid2) {
      var hex2 = uidToHex(uid2);

      if (hex2 === CARD_2) {
        console.log("Reader 2 → Access Granted (Card 2)");
        unlockDoor2();
        reader2Granted();
      } else if (hex2 === MASTER_1 || hex2 === MASTER_2) {
        console.log("Reader 2 → Master Card Detected → Access Granted");
        unlockDoor2();
        reader2Granted();

      } else {
        console.log("Reader 2 → Access Denied:", hex2);
        reader2Denied();
      }
    }
  }

}, 300);