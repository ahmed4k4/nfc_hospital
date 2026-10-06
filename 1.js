document.getElementById("scanBtn").addEventListener("click", async () => {
  if ("NDEFReader" in window) {
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.onreading = async (event) => {
        let uid = event.serialNumber;

        // Fetch JSON file
        const res = await fetch("cards.json");
        const cards = await res.json();

        // Search for card
        const card = cards.find((c) => c.uid === uid);

        if (card) {
          alert(`Welcome ${card.name}`);
          document.writeln(card.code);
        } else {
          alert(`Card not recognized`);
        }
      };
    } catch (error) {
      console.error("NFC scan failed:", error);
    }
  } else {
    alert("Web NFC not supported on this device/browser.");
  }
});