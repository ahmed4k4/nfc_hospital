// عناصر الـ dialog
const addBtn = document.getElementById('addDataBtn1');
const dialog1 = document.getElementById('detailsModal1');
const closeBtn1 = document.getElementById('closeModalBtn1');
const tabButtons1 = dialog1.querySelectorAll('.tab-btn');
const tabSections1 = dialog1.querySelectorAll('.tab-section');
const modalForm1 = document.getElementById('modalForm1');

// فتح وإغلاق الـ dialog مع أنيميشن
addBtn.addEventListener('click', () => { 
  dialog1.style.display = "flex";
  dialog1.showModal(); 
  requestAnimationFrame(() => dialog1.classList.add('showing'));
  const today = new Date().toISOString().split('T')[0];
  const dateInput = modalForm1.querySelector('input[type="date"]');
  if(dateInput && !dateInput.value) dateInput.value = today;
});

closeBtn1.addEventListener('click', () => { 
  dialog1.classList.add('hiding'); 
  dialog1.addEventListener('animationend', ()=> {
    dialog1.close(); 
    dialog1.classList.remove('showing','hiding');
  }, {once:true}); 
});

// تبديل الأقسام داخل dialog
tabButtons1.forEach(btn => {
  btn.addEventListener('click', ()=> {
    tabButtons1.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    tabSections1.forEach(sec=>sec.classList.toggle('d-none', sec.dataset.section!==tab));
  });
});

// دوال إضافة عناصر عامة مع data-key placeholders
function addText(container,label,namePrefix,keyPrefix){
  const idx = container.querySelectorAll('input[type="text"]:not(.desc-input)').length + 1;
  const div = document.createElement('div');
  div.className='mb-2 d-flex gap-2 align-items-center flex-wrap';
  div.innerHTML=`
    <input type="text" class="form-control" name="${namePrefix}${idx}" placeholder="${label} ${idx}" data-key="${keyPrefix}">
    <button type="button" class="btn btn-danger btn-sm remove-btn">×</button>
  `;
  container.appendChild(div);
  div.querySelector('.remove-btn').addEventListener('click',()=> div.remove());
}

function addFile(container,type){
  const idx = container.querySelectorAll(`.file-label[data-type="${type}"]`).length + 1;
  const div = document.createElement('div');
  div.className='mb-2 d-flex gap-2 align-items-center';
  div.innerHTML=`
    <span class="file-label" data-type="${type}" data-key="${type}">${type} ${idx}</span>
    <input type="file" class="form-control" name="${type}${idx}" accept="${type==='Image'?'image/*':'video/*'}" data-key="${type}">
    <button type="button" class="btn btn-danger btn-sm remove-btn">×</button>
  `;
  container.appendChild(div);
  const removeBtn = div.querySelector('.remove-btn');
  removeBtn.addEventListener('click',()=>{
    div.remove();
    updateFileLabels(container,type);
  });
}

function updateFileLabels(container,type){
  const labels = container.querySelectorAll(`.file-label[data-type="${type}"]`);
  labels.forEach((span,i)=>{ span.textContent = `${type} ${i+1}`; });
}

// إضافة حقل desc لكل قسم مع data-key
function addDesc(container,key){
  const input = document.createElement('input');
  input.type='text';
  input.className='form-control mb-2 desc-input';
  input.setAttribute('data-key', key);
  container.prepend(input);
  return input;
}

// الحاويات لكل قسم
const containers = {
  Operations: document.getElementById('operationsContainer1'),
  Radiology: document.getElementById('radiologyContainer1'),
  LabTests: document.getElementById('labTestsContainer1'),
  Medications: document.getElementById('medicationsContainer1'),
  Diagnosis: document.getElementById('diagnosisContainer1'),
  Symptoms: document.getElementById('symptomsContainer1')
};

// إضافة desc لكل قسم
const descInputs = {};
for(const key in containers){
  descInputs[key] = addDesc(containers[key], key+'Desc');
}

// ربط أزرار الإضافة لكل قسم
const buttonMap = {
  Operations: {text:'addOperationText1', img:'addOperationImage1', video:'addOperationVideo1'},
  Radiology: {text:'addRadiologyText1', img:'addRadiologyImage1', video:'addRadiologyVideo1'},
  LabTests: {text:'addLabTestText1', img:'addLabTestImage1', video:'addLabTestVideo1'},
  Medications: {text:'addMedicationText1', img:'addMedicationImage1', video:'addMedicationVideo1'},
  Diagnosis: {text:'addDiagnosisText1', img:'addDiagnosisImage1', video:'addDiagnosisVideo1'},
  Symptoms: {text:'addSymptomText1', img:'addSymptomImage1', video:'addSymptomVideo1'}
};

for(const key in containers){
  const btns = buttonMap[key];
  if(key !== 'Medications'){
    if(btns.text) document.getElementById(btns.text).addEventListener('click',()=>addText(containers[key],key+' Text','item', key+'Desc'));
  }
  if(btns.img) document.getElementById(btns.img).addEventListener('click',()=>addFile(containers[key],'Image'));
  if(btns.video) document.getElementById(btns.video).addEventListener('click',()=>addFile(containers[key],'Video'));
}

// Medications خاصة: إضافة دواء + جرعة فقط
const medContainer = containers.Medications;
document.getElementById('addMedicationText1').addEventListener('click', () => {
  const idx = medContainer.querySelectorAll('.med-entry').length + 1;
  const div = document.createElement('div');
  div.className = 'mb-2 d-flex gap-2 align-items-center flex-wrap med-entry';
  div.innerHTML = `
    <input type="text" class="form-control" name="med${idx}" placeholder="Medication ${idx}" data-key="Medications">
    <input type="text" class="form-control" name="dose${idx}" placeholder="Dose ${idx}" data-key="Dosage">
    <button type="button" class="btn btn-danger btn-sm remove-btn">×</button>
  `;
  medContainer.appendChild(div);
  const removeBtn = div.querySelector('.remove-btn');
  const updateNumbers = () => {
    medContainer.querySelectorAll('.med-entry').forEach((entry, i) => {
      entry.querySelector('input[name^="med"]').name = `med${i+1}`;
      entry.querySelector('input[name^="med"]').placeholder = `Medication ${i+1}`;
      entry.querySelector('input[name^="dose"]').name = `dose${i+1}`;
      entry.querySelector('input[name^="dose"]').placeholder = `Dose ${i+1}`;
    });
  };
  removeBtn.addEventListener('click', () => {
    div.remove();
    updateNumbers();
  });
});

// تخزين البيانات في JSON وعرضها
let finalData = {};
modalForm1.addEventListener('submit',(e)=>{
  e.preventDefault();
  const formData = new FormData(modalForm1);

  finalData = {
    patientDetails:{
      title:"Patient Information",
      data:{
        text: formData.get('text') || '',
        date: formData.get('date') || ''
      }
    },
    medicalHistory:{}
  };

  for(const key in containers){
    finalData.medicalHistory[key] = {
      title:key,
      desc:descInputs[key].value||"",
      images:[],
      videos:[]
    };

    // جمع النصوص لكل قسم
    let idx=1;
    containers[key].querySelectorAll('input[type="text"]').forEach(input=>{
      if(!input.classList.contains('desc-input') && input.value){
        finalData.medicalHistory[key][`item${idx}`]=input.value;
        idx++;
      }
    });

    // الصور
    containers[key].querySelectorAll('input[type="file"]').forEach(input=>{
      if(input.files.length>0 && input.accept.includes('image')) finalData.medicalHistory[key].images.push(input.files[0].name);
      if(input.files.length>0 && input.accept.includes('video')) finalData.medicalHistory[key].videos.push(input.files[0].name);
    });
  }

  console.log(finalData);
  alert('JSON data saved! Check console.');
  modalForm1.reset();
  dialog1.classList.add('hiding'); 
  dialog1.addEventListener('animationend',()=>{dialog1.close(); dialog1.classList.remove('showing','hiding');},{once:true});
});
