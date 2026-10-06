// طباعة حسب IDs
document.getElementById("printBtn").addEventListener("click", () => {
  let ids = prompt("أدخل أرقام الـ ID التي تريد طباعتها (مثال: 1,2,3)").split(",");
  if (!ids || ids.length === 0) return;

  let printContent = "";

  ids.forEach(id => {
    let row = document.getElementById("row-" + id.trim());
    if (row) {
      let details = row.nextElementSibling.cloneNode(true);
      details.style.display = "block";

      let name = document.querySelector("#patientName").textContent;
      let code = document.querySelector("#patientCode").textContent;
      let nationalId = document.querySelector("#patientNationalId").textContent;

      printContent += `
        <div style="page-break-before: always;">
          <h3>${name}</h3>
          <h5>${code}</h5>
          <h6>${nationalId}</h6>
          <table border="1" style="width:100%;border-collapse:collapse;margin-top:10px">
            ${row.outerHTML}
            ${details.outerHTML}
          </table>
        </div>
      `;
    }
  });

  let newWin = window.open("");
  newWin.document.writeln(`
    <html>
      <head>
        <title>Print</title>
        <style>
          table {border-collapse: collapse; width: 100%;}
          table, th, td {border: 1px solid black; padding: 5px;}
          @page { size: A4; margin: 15mm; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
  newWin.document.close();
  newWin.print();
});

// إظهار/إخفاء التفاصيل
document.querySelectorAll(".toggle-details").forEach(checkbox => {
  checkbox.addEventListener("change", function() {
    const detailsRow = this.closest("tr").nextElementSibling;
    detailsRow.style.display = this.checked ? "table-row" : "none";
  });
});

