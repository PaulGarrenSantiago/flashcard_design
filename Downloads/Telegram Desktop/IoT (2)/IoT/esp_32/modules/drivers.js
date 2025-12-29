/* ==========================================================
   MFRC522 Driver Module for Espruino + ESP32
   This version matches your working MFRC522 class exactly.
   ========================================================== */

function MFRC522(spi, cs, rst) {
  this.spi = spi;
  this.cs = cs;
  this.rst = rst;

  pinMode(this.cs, "output");
  digitalWrite(this.cs, 1);

  if (this.rst !== null && this.rst !== undefined) {
    pinMode(this.rst, "output");
    digitalWrite(this.rst, 1); // keep high
  }

  this.reset();
  this.init();
  this.antennaOn();
}

/* ===== Low Level SPI Read/Write ===== */

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

/* ===== Initialization ===== */

MFRC522.prototype.reset = function () {
  this.write(0x01, 0x0F); // SoftReset
};

MFRC522.prototype.init = function () {
  this.write(0x2A, 0x8D);    // TModeReg
  this.write(0x2B, 0x3E);    // TPrescalerReg
  this.write(0x2D, 30);      // ReloadRegL
  this.write(0x2C, 0);       // ReloadRegH
  this.write(0x15, 0x40);    // TxASKReg
  this.write(0x11, 0x3D);    // ModeReg
};

MFRC522.prototype.antennaOn = function () {
  var v = this.read(0x14);
  if ((v & 0x03) !== 0x03) {
    this.write(0x14, v | 0x03); // turn antenna on
  }
};

/* ===== Command Handler ===== */

MFRC522.prototype.command = function (cmd, data) {
  this.write(0x01, 0x00);          // Idle
  this.write(0x0A, 0x80);          // Flush FIFO

  if (data) {
    for (var i = 0; i < data.length; i++)
      this.write(0x09, data[i]);  // FIFOData
  }

  this.write(0x01, cmd);           // Execute command

  if (cmd === 0x0C) { // Transceive
    this.write(0x0D, this.read(0x0D) | 0x80);
  }

  var i = 2000, irq;
  do {
    irq = this.read(0x04); // ComIrqReg
    i--;
  } while (i && !(irq & 0x30));

  if (!i) return false;

  if (this.read(0x06) & 0x13) return false; // ErrorReg

  var length = this.read(0x0A); // FIFOLevel
  var res = [];
  for (var j = 0; j < length; j++)
    res.push(this.read(0x09));

  return res;
};

/* ===== Card Functions ===== */

MFRC522.prototype.request = function (mode) {
  this.write(0x0D, 0x07);  // 7-bit framing for REQA
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

MFRC522.prototype.toHexString = function (uid) {
  return uid.map(b => ("0" + b.toString(16)).slice(-2)).join(":");
};

/* ===== EXPORT MODULE ===== */

exports.connect = function (spi, cs, rst) {
  return new MFRC522(spi, cs, rst);
};
