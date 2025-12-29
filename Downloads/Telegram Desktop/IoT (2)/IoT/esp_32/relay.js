/* =======================================================
   RELAY MODULE FOR TWO LOCKERS (ESP32)
   ======================================================= */

// Define pins for the two relays
const RELAY1_PIN = D25; // Locker 1
const RELAY2_PIN = D13; // Locker 2

// Initialize pins as outputs and set low (off)
pinMode(RELAY1_PIN, 'output');
digitalWrite(RELAY1_PIN, 0);

pinMode(RELAY2_PIN, 'output');
digitalWrite(RELAY2_PIN, 0);

// Unlock locker 1 for a given duration (default 1 second)
function unlockLocker1(duration) {
  if (duration === undefined) duration = 1000;
  digitalWrite(RELAY1_PIN, 1);
  setTimeout(() => digitalWrite(RELAY1_PIN, 0), duration);
}

function unlockLocker2(duration) {
  if (duration === undefined) duration = 1000;
  digitalWrite(RELAY2_PIN, 1);
  setTimeout(() => digitalWrite(RELAY2_PIN, 0), duration);
}

// Optional: test function to sequentially unlock both lockers
function testRelays() {
  console.log("Testing Locker 1");
  unlockLocker1();
  setTimeout(() => {
    console.log("Testing Locker 2");
    unlockLocker2();
  }, 2000); // 2-second delay between lockers
}

// Export functions for use in main.js
exports.unlockLocker1 = unlockLocker1;
exports.unlockLocker2 = unlockLocker2;
exports.testRelays = testRelays;
