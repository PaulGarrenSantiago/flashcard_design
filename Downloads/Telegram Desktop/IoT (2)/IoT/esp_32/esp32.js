var wifi = require("Wifi");
var http = require("http");

const WIFI_SSID = "Faallllyy";
const WIFI_PASS = "faalllyy";

const SERVER_IP   = "192.168.50.102"; // your backend
const SERVER_PORT = 3000;

var systemReady = false;

console.log("Connecting to WiFi:", WIFI_SSID);
wifi.connect(WIFI_SSID, { password: WIFI_PASS }, function (err) {
  if (err) {
    console.log("WiFi error:", err);
    return;
  }
  console.log("WiFi connected:", wifi.getIP().ip);
  console.log("Server target:", SERVER_IP + ":" + SERVER_PORT);
  systemReady = true;
});

/* =======================================================
   MFRC522 Driver for ESP32 + Espruino
   TWO RFID Readers
   Valid cards assigned per reader
   ======================================================= */

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

/* ======================================================
   send to server function
   ====================================================== */
function sendToServer(uid, reader) {
  if (!systemReady || busy) return;

  busy = true;

  var payload = JSON.stringify({
    uid: uid.replace(/:/g, "").toUpperCase(),
    locker_number: reader
  });

  var req = http.request({
    host: SERVER_IP,
    port: SERVER_PORT,
    path: "/rfid",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length
    }
  }, function (res) {
    console.log("Server responded, status:", res.statusCode);
    var body = "";
    res.on("data", d => body += d);
    res.on("end", function () {
      console.log("Response body:", body);
      try {
        var r = JSON.parse(body);
        console.log("Parsed response:", r);

        if (r.status === "Access granted") {
          console.log(" Access granted for reader", reader);
          if (reader === 1) {
            reader1Granted();
            unlockDoor();
          } else {
            reader2Granted();
            unlockDoor2();
          }
        } else {
          console.log("L Access denied:", r.status);
          if (reader === 1) reader1Denied();
          else reader2Denied();
        }
      } catch (e) {
        console.log("Bad response, parse error:", e);
      }
      busy = false;
    });
  });

  req.on("error", function (err) {
    console.log("L HTTP error:", err);
    busy = false;
  });

  req.write(payload);
  req.end();
}



/* =======================================================
   CARD ASSIGNMENTS
   ======================================================= */

// FORMAT � lowercase hex with : separator
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

var loopCount = 0;
setInterval(function () {
  loopCount++;
  
  if (!systemReady) {
    if (loopCount % 20 === 0) console.log("� Waiting for WiFi...");
    return;
  }
  
  if (busy) {
    if (loopCount % 20 === 0) console.log("� Busy - waiting for response...");
    return;
  }

  if (rfid1.isCard()) {
    console.log("=� Card detected on Reader 1");
    var uid = rfid1.getUID();
    if (uid) {
      var hexUid = uidToHex(uid);
      console.log("<� Reader 1 UID:", hexUid);
      sendToServer(hexUid, 1);
      return;
    } else {
      console.log("� Reader 1: Failed to get UID");
    }
  }

  if (rfid2.isCard()) {
    console.log("=� Card detected on Reader 2");
    var uid2 = rfid2.getUID();
    if (uid2) {
      var hexUid2 = uidToHex(uid2);
      console.log("<� Reader 2 UID:", hexUid2);
      sendToServer(hexUid2, 2);
      return;
    } else {
      console.log("� Reader 2: Failed to get UID");
    }
  }
}, 300);

console.log(" System initialized. Waiting for cards...");