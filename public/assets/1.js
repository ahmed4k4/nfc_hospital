fetch('data.json')
  .then(res => res.ok ? res.json() : Promise.reject("ملف غير موجود"))
  .then(data => {
    if (!Array.isArray(data) || data.length < 2) throw new Error("هيكل البيانات غير صحيح");

    const personalData = data[0];
    const patientDetails = data[1].patientDetails || {};
    const medicalHistoryArr = Array.isArray(data[1].medicalHistory) ? data[1].medicalHistory : [];

    // عرض بيانات المستخدم
    document.querySelectorAll("[data-server-user]").forEach(el => {
      const key = el.getAttribute("data-server-user");
      if (personalData[key]) el.textContent = personalData[key];
      else el.closest(".col-md-6, .col-md-12")?.remove();
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
      table.innerHTML = "<thead><tr><th>Detail</th><th>Date</th></tr></thead>";
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

    const icons = { Operations:"fa-scalpel", Radiology:"fa-x-ray", "Lab Tests":"fa-vials", Medications:"fa-pills", Diagnosis:"fa-notes-medical", Symptoms:"fa-head-side-cough"};
    const style = { Operations:"operations", Radiology:"radiology", "Lab Tests":"analysis", Medications:"medicine", Diagnosis:"diagnosis", Symptoms:"symptoms"};

    // حفظ كل الصفوف في مصفوفة للpagination
    const rowPairs = medicalHistoryArr.map((record, index) => {
      const mainRow = document.createElement("tr");
      mainRow.innerHTML = `
        <td class="row-number" style="text-align:center;"></td>
        <td>
        <div class="form-check">
          <input class="form-check-input toggle-details" type="checkbox" id="check-${index}">
          <label class="form-check-label" for="check-${index}">عرض/إخفاء</label>
        </div></td>
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
        if(sectionKey==="data") return;
        const sectionData = record[sectionKey];
        if(!sectionData) return;

        const col = document.createElement("div");
        col.className="col-lg-4 col-md-6 col-sm-12 d-flex";
        const card = document.createElement("div");
        card.className = `custom-card ${style[sectionKey]||""} w-100`;

        // أيقونة
        const icon = document.createElement("div");
        icon.className="card-icon";
        icon.innerHTML = `<i class="fa-solid ${icons[sectionKey]||"fa-circle-info"}"></i>`;
        card.appendChild(icon);

        // العنوان
        const h5 = document.createElement("h5");
        h5.textContent = sectionData.title || sectionKey;
        card.appendChild(h5);

        // الوصف
        if(sectionData.desc){ const p=document.createElement("p"); p.textContent=sectionData.desc; card.appendChild(p); }

        // العناصر
        const items = Object.keys(sectionData).filter(k=>k.startsWith("item"));
        if(items.length){ const ul=document.createElement("ul"); items.forEach(k=>{ const li=document.createElement("li"); li.textContent=sectionData[k]; ul.appendChild(li);}); card.appendChild(ul); }

        // جدول أدوية
        if(sectionKey==="Medications"){
          const tableMed=document.createElement("table");
          tableMed.className="table table-sm table-bordered mb-0";
          tableMed.innerHTML=`<thead><tr><th>Medication</th><th>Dosage</th></tr></thead>`;
          const tbodyMed=document.createElement("tbody");
          let i=1;
          while(sectionData[`med${i}`]||sectionData[`dose${i}`]){
            tbodyMed.innerHTML+=`<tr><td>${sectionData[`med${i}`]||""}</td><td>${sectionData[`dose${i}`]||""}</td></tr>`;
            i++;
          }
          tableMed.appendChild(tbodyMed);
          card.appendChild(tableMed);
        }

        card.addEventListener("click",()=>{
          document.getElementById("modalTitle").textContent=sectionData.title||sectionKey;
          const modalBody=document.getElementById("modalBody");
          modalBody.innerHTML="";
          if(sectionData.desc){ const p=document.createElement("p"); p.textContent=sectionData.desc; modalBody.appendChild(p);}
          if(items.length){ const ul=document.createElement("ul"); items.forEach(k=>{ const li=document.createElement("li"); li.textContent=sectionData[k]; ul.appendChild(li);}); modalBody.appendChild(ul);}
          if(sectionKey==="Medications"){ const tableFrame=document.createElement("div"); tableFrame.className="table-frame"; const tableClone=card.querySelector("table").cloneNode(true); tableClone.classList.add("custom-table"); tableFrame.appendChild(tableClone); modalBody.appendChild(tableFrame);}
          if(Array.isArray(sectionData.images)){ const imgWrapper=document.createElement("div"); imgWrapper.className="modal-images"; sectionData.images.forEach(img=>{ const imageEl=document.createElement("img"); imageEl.src=img; imageEl.alt=sectionData.title||"Image"; imgWrapper.appendChild(imageEl);}); modalBody.appendChild(imgWrapper);}
          if(Array.isArray(sectionData.videos)){ const vidWrapper=document.createElement("div"); vidWrapper.className="modal-videos"; sectionData.videos.forEach(vid=>{ const videoEl=document.createElement("video"); videoEl.src=vid; videoEl.controls=true; videoEl.preload="metadata"; vidWrapper.appendChild(videoEl);}); modalBody.appendChild(vidWrapper);}
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
  const totalPages=Math.ceil(rowPairs.length/rowsPerPage);

  // إنشاء pagination
  let pagination = parentTable.parentElement.querySelector(".pagination");
  if(!pagination){ pagination=document.createElement("div"); pagination.className="pagination"; pagination.style.textAlign="center"; pagination.style.marginTop="10px"; parentTable.parentElement.appendChild(pagination);}

  function renderPage(page){
    tbody.innerHTML="";
    const start=(page-1)*rowsPerPage;
    const end=start+rowsPerPage;
    rowPairs.slice(start,end).forEach((pair, idx)=>{
      tbody.appendChild(pair[0]);
      tbody.appendChild(pair[1]);
      pair[0].querySelector(".row-number").textContent = start+idx+1;
    });
    renderPagination();
  }

  function renderPagination(){
    pagination.innerHTML="";
    const prevBtn=document.createElement("button");
    prevBtn.textContent="« السابق";
    prevBtn.style.margin="0 3px"; prevBtn.disabled=currentPage===1;
    prevBtn.addEventListener("click",()=>{ if(currentPage>1){currentPage--; renderPage(currentPage);}});
    pagination.appendChild(prevBtn);

    for(let i=1;i<=totalPages;i++){
      const btn=document.createElement("button");
      btn.textContent=i;
      btn.style.margin="0 3px"; btn.style.padding="4px 8px"; btn.style.borderRadius="6px"; btn.style.border="1px solid #ccc"; btn.style.cursor="pointer";
      btn.style.background=i===currentPage?"#007bff":"#fff"; btn.style.color=i===currentPage?"#fff":"#000";
      btn.addEventListener("click",()=>{currentPage=i; renderPage(currentPage);});
      pagination.appendChild(btn);
    }

    const nextBtn=document.createElement("button");
    nextBtn.textContent="التالي »"; nextBtn.style.margin="0 3px"; nextBtn.disabled=currentPage===totalPages;
    nextBtn.addEventListener("click",()=>{if(currentPage<totalPages){currentPage++; renderPage(currentPage);}});
    pagination.appendChild(nextBtn);
  }

  renderPage(currentPage);
}

// المودال
const detailsModal=document.getElementById('detailsModal');
const closeModalBtn=document.getElementById('closeModalBtn');
function openModal(){ if(typeof detailsModal.showModal==="function"){detailsModal.showModal(); detailsModal.classList.remove("hiding"); detailsModal.classList.add("showing");}}
function closeModal(){ detailsModal.classList.remove("showing"); detailsModal.classList.add("hiding"); setTimeout(()=>{detailsModal.close(); detailsModal.classList.remove("hiding");},400);}
closeModalBtn.addEventListener('click',closeModal);
detailsModal.addEventListener('click',(e)=>{const rect=detailsModal.getBoundingClientRect(); if(!(e.clientX>=rect.left && e.clientX<=rect.right && e.clientY>=rect.top && e.clientY<=rect.bottom)){closeModal();}});
