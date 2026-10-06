fetch('data.json')
  .then(res => {
    if (!res.ok) throw new Error("ملف غير موجود");
    return res.json();
  })
  .then(data => {
    if (!Array.isArray(data) || data.length < 2) throw new Error("هيكل البيانات غير صحيح");

    const personalData = data[0];
    const patientDetails = data[1].patientDetails || {};
    const medicalHistoryArr = Array.isArray(data[1].medicalHistory) ? data[1].medicalHistory : [];

    // عرض بيانات المستخدم
    document.querySelectorAll("[data-server-user]").forEach(el => {
      const key = el.getAttribute("data-server-user");
      if (personalData[key]) {
        el.textContent = personalData[key];
      } else {
        el.closest(".col-md-6, .col-md-12")?.remove();
      }
    });

    // صورة البروفايل
    const avatarContainer = document.querySelector(".avatar");
    avatarContainer.innerHTML = personalData.image
      ? `<img src="${personalData.image}" alt="User Image" style="width:140px;height:140px;object-fit:cover;border-radius:50%;">`
      : `<i class="fa-solid fa-circle-user fa-7x text-secondary"></i>`;

    // تفاصيل المريض
    const detailsContainer = document.getElementById("details");
    detailsContainer.innerHTML = "";
    if (Array.isArray(patientDetails.data) && patientDetails.data.length > 0) {
      const table = document.createElement("table");
      table.className = "table table-sm table-bordered custom-table";
      table.innerHTML = `<thead><tr><th data-key="details">Detail</th><th data-key="date">Date</th></tr></thead>`;
      const tbody = document.createElement("tbody");
      patientDetails.data.forEach(row => {
        tbody.innerHTML += `<tr><td>${row.text || ""}</td><td>${row.date || ""}</td></tr>`;
      });
      table.appendChild(tbody);
      const wrapper = document.createElement("div");
      wrapper.style.maxHeight = "180px";
      wrapper.style.overflowY = patientDetails.data.length > 4 ? "auto" : "visible";
      wrapper.appendChild(table);
      detailsContainer.appendChild(wrapper);
    }

    // التاريخ الطبي في جدول
    const historyTableBody = document.querySelector("#history table tbody");
    historyTableBody.innerHTML = "";
    const icons = {
      Operations: "fa-scalpel",
      Radiology: "fa-x-ray",
      "Lab Tests": "fa-vials",
      Medications: "fa-pills",
      Diagnosis: "fa-notes-medical",
      Symptoms: "fa-head-side-cough"
    };
    const style = {
      Operations: "operations",
      Radiology: "radiology",
      "Lab Tests": "analysis",
      Medications: "medicine",
      Diagnosis: "diagnosis",
      Symptoms: "symptoms"
    };

    const rowPairs = medicalHistoryArr.map((record, index) => {
      const mainRow = document.createElement("tr");
      mainRow.innerHTML = `
        <td class="row-number" style="text-align:center;"></td>
        <td>
          <div class="form-check">
            <input class="form-check-input toggle-details" type="checkbox" id="check-${index}">
            <label class="form-check-label" for="check-${index}">عرض/إخفاء</label>
          </div>
        </td>
        <td>${record.data.date}</td>
        <td>${record.data.diagnosis}</td>
        <td>${record.data.treatment}</td>
        <td>${record.data.medication}</td>
        <td>${record.data.notes}</td>
      `;

      const detailsRow = document.createElement("tr");
      detailsRow.classList.add("details-row", "hide");
      const detailsCell = document.createElement("td");
      detailsCell.colSpan = 7;
      detailsRow.appendChild(detailsCell);

      const rowDiv = document.createElement("div");
      rowDiv.className = "row g-4 justify-content-center";

      Object.keys(record).forEach(sectionKey => {
        if (sectionKey === "data") return;
        const sectionData = record[sectionKey];
        if (!sectionData) return;

        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 col-sm-12 d-flex";

        const card = document.createElement("div");
        card.className = `custom-card ${style[sectionKey]} w-100`;

        // أيقونة
        const icon = document.createElement("div");
        icon.className = "card-icon";
        icon.innerHTML = `<i class="fa-solid ${icons[sectionKey] || "fa-circle-info"}"></i>`;
        card.appendChild(icon);

        // العنوان
        const h5 = document.createElement("h5");
        h5.textContent = sectionData.title || sectionKey;
        h5.setAttribute("data-key", sectionKey);
        card.appendChild(h5);

        // الوصف
        if (sectionData.desc) {
          const p = document.createElement("p");
          p.textContent = sectionData.desc;
          card.appendChild(p);
        }

        // العناصر (items)
        const items = Object.keys(sectionData).filter(k => k.startsWith("item"));
        if (items.length) {
          const ul = document.createElement("ul");
          items.forEach(k => {
            const li = document.createElement("li");
            li.textContent = sectionData[k];
            ul.appendChild(li);
          });
          card.appendChild(ul);
        }

        // جدول الأدوية (لو موجود)
        if (sectionKey === "Medications") {
          const table = document.createElement("table");
          table.className = "table table-sm table-bordered mb-0";
          table.innerHTML = `<thead><tr><th data-key="Medications">Medication</th><th data-key="Dosage">Dosage</th></tr></thead>`;
          const tbody = document.createElement("tbody");
          let i = 1;
          while (sectionData[`med${i}`] || sectionData[`dose${i}`]) {
            tbody.innerHTML += `<tr><td>${sectionData[`med${i}`] || ""}</td><td>${sectionData[`dose${i}`] || ""}</td></tr>`;
            i++;
          }
          table.appendChild(tbody);
          card.appendChild(table);
        }

        // عند الضغط على الكارت → افتح الدايالوج بنفس المحتوى
        card.addEventListener("click", () => {
          document.getElementById("modalTitle").textContent = sectionData.title;
          document.getElementById("modalTitle").setAttribute("data-key", sectionKey);
          const modalBody = document.getElementById("modalBody");
          modalBody.innerHTML = "";

          // نسخ الوصف
          if (sectionData.desc) {
            const descP = document.createElement("p");
            descP.textContent = sectionData.desc;
            modalBody.appendChild(descP);
          }

          // نسخ العناصر
          if (items.length) {
            const ul = document.createElement("ul");
            items.forEach(k => {
              const li = document.createElement("li");
              li.textContent = sectionData[k];
              ul.appendChild(li);
            });
            modalBody.appendChild(ul);
          }

          // جدول الأدوية
          if (sectionKey === "Medications") {
            const tableFrame = document.createElement("div");
            tableFrame.className = "table-frame"; // إطار جميل
            const tableClone = card.querySelector("table").cloneNode(true);
            tableClone.classList.add("custom-table"); // عشان الهوفر يشتغل
            tableFrame.appendChild(tableClone);
            modalBody.appendChild(tableFrame);
          }

          // الصور
          if (Array.isArray(sectionData.images) && sectionData.images.length > 0) {
            const imgWrapper = document.createElement("div");
            imgWrapper.className = "modal-images";
            sectionData.images.forEach(img => {
              const imageEl = document.createElement("img");
              imageEl.src = img;
              imageEl.alt = sectionData.title || "Image";
              imgWrapper.appendChild(imageEl);
            });
            modalBody.appendChild(imgWrapper);
          }

          // الفيديوهات
          if (Array.isArray(sectionData.videos) && sectionData.videos.length > 0) {
            const vidWrapper = document.createElement("div");
            vidWrapper.className = "modal-videos";
            sectionData.videos.forEach(vid => {
              const videoEl = document.createElement("video");
              videoEl.src = vid;
              videoEl.controls = true;
              videoEl.preload = "metadata";
              vidWrapper.appendChild(videoEl);
            });
            modalBody.appendChild(vidWrapper);
          }

          openModal();
        });

        col.appendChild(card);
        rowDiv.appendChild(col);
      });


      detailsCell.appendChild(rowDiv);

      // checkbox toggle
      mainRow.querySelector(".toggle-details").addEventListener("change", e=>{
        detailsRow.classList.toggle("hide", !e.target.checked);
      });

      return [mainRow, detailsRow];
  });
    applyTablePagination(historyTableBody, rowPairs, 10);
  })
  .catch(err => console.error(err));

function applyTablePagination(tbody, rowPairs, rowsPerPage){
  const parentTable = tbody.closest("table");
  let currentPage=1;
  const reversedPairs = [...rowPairs].reverse();

  const totalPages = Math.ceil(reversedPairs.length / rowsPerPage);

  // إنشاء pagination
  let pagination = parentTable.parentElement.querySelector(".pagination");
  if(!pagination){ pagination=document.createElement("div"); pagination.className="pagination"; pagination.style.textAlign="center"; pagination.style.marginTop="10px"; parentTable.parentElement.appendChild(pagination);}

  function renderPage(page){
    tbody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    reversedPairs.slice(start, end).forEach((pair, idx) => {
      tbody.appendChild(pair[0]);
      tbody.appendChild(pair[1]);
      // تحديث أرقام الصفوف إذا عندك عنصر row-number
      pair[0].querySelector(".row-number").textContent = start + idx + 1;
    });
    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = "";

    const createBtn = (text, page, disabled = false, active = false, key = "") => {
      const btn = document.createElement("button");
      btn.textContent = text;
      if (key) btn.setAttribute("data-key", key); // إضافة data-key
      btn.className = "btn " + (active ? "btn-primary" : "btn-outline-primary");
      btn.disabled = disabled;
      btn.addEventListener("click", () => {
        if (!disabled && page !== currentPage) {
          currentPage = page;
          renderPage(currentPage);
        }
      });
      return btn;
    };

    // زر السابق مع data-key="previous"
    const prevText = translations[savedLang].previous || "« السابق";
    pagination.appendChild(createBtn(prevText, currentPage - 1, currentPage === 1, false, "previous"));

    // أرقام الصفحات
    const visiblePages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      visiblePages.push(1);
      if (currentPage > 3) visiblePages.push("...");
      if (currentPage > 2) visiblePages.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages) visiblePages.push(currentPage);
      if (currentPage < totalPages - 1) visiblePages.push(currentPage + 1);
      if (currentPage < totalPages - 2) visiblePages.push("...");
      visiblePages.push(totalPages);
    }

    visiblePages.forEach(p => {
      if (p === "...") {
        const span = document.createElement("span");
        span.textContent = "...";
        pagination.appendChild(span);
      } else {
        pagination.appendChild(createBtn(p, p, false, p === currentPage));
      }
    });

    // زر التالي مع data-key="next"
    const nextText = translations[savedLang].next || "التالي »";
    pagination.appendChild(createBtn(nextText, currentPage + 1, currentPage === totalPages, false, "next"));
  }



  renderPage(currentPage);
}



// المودال
const detailsModal = document.getElementById('detailsModal');
const closeModalBtn = document.getElementById('closeModalBtn');

function openModal() {
  if (typeof detailsModal.showModal === "function") {
    detailsModal.style.display = "block";
    detailsModal.showModal();
    detailsModal.classList.remove("hiding");
    detailsModal.classList.add("showing");
  }
}
function closeModal() {
  detailsModal.classList.remove("showing");
  detailsModal.classList.add("hiding");
  setTimeout(() => {
    detailsModal.close();
    detailsModal.classList.remove("hiding");
  }, 400);
}
closeModalBtn.addEventListener('click', closeModal);
detailsModal.addEventListener('click', (e) => {
  const rect = detailsModal.getBoundingClientRect();
  if (!(e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom)) {
    closeModal();
  }
});
