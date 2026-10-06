#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

void setup() {
  Serial.begin(115200);
  Wire.begin();
  nfc.begin();
  Serial.println("NFC Writer Ready - Place your tag to write URL");
}

void loop() {
  if (nfc.tagPresent()) {
    NdefMessage message = NdefMessage();

    // الرابط اللي هيتفتح تلقائيًا
    String url = "https://ahmed4k4.github.io/CV-Ahmed-Adel/";
    message.addUriRecord(url);

    bool writeSuccess = nfc.write(message);
    if (writeSuccess) {
      Serial.println("✅ URL written successfully. Scan tag with phone to open site.");
    } else {
      Serial.println("❌ Failed to write URL.");
    }

    delay(2000); // استراحة قبل إعادة المحاولة
  }
}
