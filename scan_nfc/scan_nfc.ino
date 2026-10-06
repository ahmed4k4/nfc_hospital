#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc(pn532_i2c);

void setup() {
  Serial.begin(115200);
  Wire.begin();
  nfc.begin();
  Serial.println("Approach an NFC tag to read data...");
}
// E3 99 85 FD
// 63 8A EB F4
void loop() {
  if (nfc.tagPresent()) {
    NfcTag tag = nfc.read();

    // عرض UID (العنوان)
    Serial.print("Tag UID: ");
    Serial.println(tag.getUidString()); // العنوان الفريد من المصنع

    // عرض نوع الكارت
    Serial.print("Tag Type: ");
    Serial.println(tag.getTagType());

    // لو فيه NDEF data
    if (tag.hasNdefMessage()) {
      NdefMessage message = tag.getNdefMessage();
      Serial.print("Number of NDEF Records: ");
      Serial.println(message.getRecordCount());

      // قراءة كل Record
      for (int i = 0; i < message.getRecordCount(); i++) {
        NdefRecord record = message.getRecord(i);
        int payloadLength = record.getPayloadLength();
        byte payload[payloadLength];
        record.getPayload(payload);

        Serial.print("Record #");
        Serial.print(i + 1);
        Serial.print(" Payload: ");

        for (int j = 0; j < payloadLength; j++) {
          Serial.print((char)payload[j]);
        }
        Serial.println();
      }
    } else {
      Serial.println("No NDEF message found on this tag.");
    }

    Serial.println("--------------------------");
    delay(1500); // انتظار قبل القراءة التالية
  }
}
