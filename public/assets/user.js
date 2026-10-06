// جلب البيانات
fetch('data.json')
  .then(res => {
    if (!res.ok) throw new Error("ملف غير موجود");
    return res.json();
  })
  .then(data => {
    if (!Array.isArray(data) || data.length < 2) throw new Error("هيكل البيانات غير صحيح");

    const personalData = data[0];
    const patientDetails = data[1].patientDetails || {};
    const medicalHistory = data[1].medicalHistory || {};

    // عرض بيانات المستخدم وحذف البلوكات الفارغة
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
      ? `<img src="${personalData.image}" alt="User Image">`
      : `<i class="fa-solid fa-circle-user fa-7x text-secondary"></i>`;

    // عرض تفاصيل المريض كمصفوفة نصوص + تواريخ
    const detailsContainer = document.getElementById("details");
    detailsContainer.innerHTML = "";

    if (patientDetails.data && Array.isArray(patientDetails.data) && patientDetails.data.length > 0) {
      const table = document.createElement("table");
      table.className = "table table-sm table-bordered";
      table.classList.add("table", "table-sm", "table-bordered", "table-hover", "custom-table");

      const thead = document.createElement("thead");
      thead.innerHTML = `<tr><th data-key="details">Detail</th><th data-key="date">Date</th></tr>`;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      patientDetails.data.forEach(row => {
        const tr = document.createElement("tr");

        const tdText = document.createElement("td");
        tdText.textContent = row.text || "";
        tr.appendChild(tdText);

        const tdDate = document.createElement("td");
        tdDate.textContent = row.date || "";
        tr.appendChild(tdDate);

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);

      // عمل Scroll داخلي لو البيانات أكتر من 4 صفوف
      const wrapper = document.createElement("div");
      wrapper.style.maxHeight = "180px";
      wrapper.style.overflowY = patientDetails.data.length > 4 ? "auto" : "visible";
      wrapper.appendChild(table);

      detailsContainer.appendChild(wrapper);
    }


    // عرض التاريخ الطبي
    const historyContainer = document.getElementById("printTable");
    historyContainer.innerHTML = "";
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

    Object.keys(medicalHistory).forEach(sectionKey => {
      const sectionData = medicalHistory[sectionKey];
      if (!sectionData || Object.keys(sectionData).length === 0) return;

      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 col-sm-12 d-flex";

      const card = document.createElement("div");
      card.className = `custom-card ${style[sectionKey]} w-100`;

      // أيقونة
      const icon = document.createElement("div");
      icon.className = "card-icon";
      icon.innerHTML = `<i class="fa-solid ${icons[sectionKey] || 'fa-circle-info'}"></i>`;
      card.appendChild(icon);

      // عنوان ووصف
      if (sectionData.title) {
        const h5 = document.createElement("h5");
        h5.textContent = sectionData.title;
        h5.setAttribute("data-key", sectionKey);
        card.appendChild(h5);
      }
      if (sectionData.desc) {
        const p = document.createElement("p");
        p.textContent = sectionData.desc;
        card.appendChild(p);
      }

      // عرض قائمة العناصر
      if (sectionKey === "Medications") {
        const table = document.createElement("table");
        table.className = "table table-sm table-bordered mb-0";
        table.classList.add("table", "table-sm", "table-bordered", "table-hover", "custom-table");
        const thead = document.createElement("thead");
        thead.innerHTML = `<tr><th data-key="Medications">Medication</th><th data-key="Dosage">Dosage</th></tr>`;
        table.appendChild(thead);
        const tbody = document.createElement("tbody");

        let i = 1;
        while (sectionData[`med${i}`] || sectionData[`dose${i}`]) {
          const tr = document.createElement("tr");
          const tdMed = document.createElement("td");
          tdMed.textContent = sectionData[`med${i}`] || "";
          const tdDose = document.createElement("td");
          tdDose.textContent = sectionData[`dose${i}`] || "";
          tr.appendChild(tdMed);
          tr.appendChild(tdDose);
          tbody.appendChild(tr);
          i++;
        }

        table.appendChild(tbody);
        card.appendChild(table);
      } else {
        const items = Object.keys(sectionData).filter(k => k.startsWith("item"));
        if (items.length) {
          const ul = document.createElement("ul");
          items.forEach(key => {
            const li = document.createElement("li");
            li.textContent = sectionData[key];
            li.style.direction = "ltr";
            li.style.textAlign = "left";
            ul.appendChild(li);
          });
          card.appendChild(ul);
        }
      }

      // عند الضغط على الكارت
      card.addEventListener("click", () => {
        document.getElementById("modalTitle").textContent = sectionData.title;
        document.getElementById("modalTitle").setAttribute("data-key", sectionKey);
        const modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = "";

        // الوصف
        if (sectionData.desc) {
          const descP = document.createElement("p");
          descP.textContent = sectionData.desc;
          modalBody.appendChild(descP);
        }

        // العناصر
        const items = Object.keys(sectionData).filter(k => k.startsWith("item"));
        if (items.length) {
          const ul = document.createElement("ul");
          items.forEach(k => {
            const li = document.createElement("li");
            li.textContent = sectionData[k];
            li.style.direction = "ltr";
            li.style.textAlign = "left";
            ul.appendChild(li);
          });
          modalBody.appendChild(ul);
        }

        // الأدوية
        if (sectionKey === "Medications") {
          const table = document.createElement("table");
          table.className = "table table-sm table-bordered";
          table.classList.add("table", "table-sm", "table-bordered", "table-hover", "custom-table");
          const thead = document.createElement("thead");
          thead.innerHTML = "<tr><th>Medication</th><th>Dosage</th></tr>";
          table.appendChild(thead);
          const tbody = document.createElement("tbody");

          let i = 1;
          while (sectionData[`med${i}`] || sectionData[`dose${i}`]) {
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.textContent = sectionData[`med${i}`] || "";
            const td2 = document.createElement("td");
            td2.textContent = sectionData[`dose${i}`] || "";
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
            i++;
          }

          table.appendChild(tbody);
          modalBody.appendChild(table);
        }

      // عرض الصور
      if (sectionData.images && Array.isArray(sectionData.images) && sectionData.images.length > 0) {
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

      // عرض الفيديوهات
      if (sectionData.videos && Array.isArray(sectionData.videos) && sectionData.videos.length > 0) {
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
      historyContainer.appendChild(col);
    });
  })
  .catch(err => console.error(err));


// إعداد المودال باستخدام <dialog>
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

// إغلاق عند الضغط خارج المودال
detailsModal.addEventListener('click', (e) => {
  const rect = detailsModal.getBoundingClientRect();
  const inDialog =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;
  if (!inDialog) closeModal();
});
