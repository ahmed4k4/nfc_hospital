#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

// استخدم I2C
PN532_I2C pn532i2c(Wire);
NfcAdapter nfc(pn532i2c);

void setup() {
  Serial.begin(115200);
  while (!Serial) ; // للوحةات اللي بتحتاج Serial جاهز
  Wire.begin();      // مهم لبدء I2C
  nfc.begin();
  Serial.println("NFC eraser ready. Approach a tag to erase (write empty).");
  delay(1000);
}

void loop() {
  Serial.println("\nPlace an NFC tag to erase it...");
  if (nfc.tagPresent()) {
    Serial.println("Tag detected. Erasing...");

    // طريقة 1: كتابة سجل نصي فارغ (يعتمد عليه لمعظم البطاقات)
    NdefMessage emptyMsg;
    emptyMsg.addTextRecord(""); // نكتب نص فارغ ليحل محل البيانات القديمة

    bool ok = nfc.write(emptyMsg);
    if (ok) {
      Serial.println("Erased (wrote empty text record) ✅");
    } else {
      Serial.println("Write failed. Trying alternative erase method...");
      // طريقة احتياطية: محاولة كتابة رسالة تحتوي على لفظ "ERASED" بدل فارغ
      NdefMessage alt;
      alt.addTextRecord("ERASED");
      if (nfc.write(alt)) {
        Serial.println("Wrote 'ERASED' fallback ✅");
      } else {
        Serial.println("Fallback also failed — tag may be read-only or incompatible.");
      }
    }

    // بعض البطاقات قد تحتاج وقت قبل أن تُقرأ مجدداً
    delay(1500);
  }

  delay(800);
}
