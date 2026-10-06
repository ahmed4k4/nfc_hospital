const translations = {
  en: {
    personalCode: "Personal Code:",
    name: "Name:",
    nationalId: "National ID:",
    occupation: "Occupation:",
    dob: "Date of Birth:",
    phone: "Personal Phone:",
    closeContact: "Close Contact Phone:",
    governorate: "Governorate:",
    medicalCondition: "Medical Condition:",
    patientDetails: "Patient Details",
    medicalHistory: "Medical History",
    date: "Date",
    diagnosis: "Diagnosis",
    treatment: "Treatment",
    medication: "Medication",
    dose: "Dose",
    notes: "Notes",
    previous: "Previous",
    next: "Next",
    printTable: "Print Table",
    details: "Details",
    showHide: "Show/Hide",

    // Dialog-specific
    addMedicalData: "Add Medical Data",
    patientInfo: "Patient Info",
    operations: "Operations",
    radiology: "Radiology",
    analysis: "Lab Tests",
    Medications: "Medications",
    diagnosisTitle: "Diagnosis",
    symptoms: "Symptoms",
    addTextBtn: "Add Text",
    addImageBtn: "Add Image",
    addVideoBtn: "Add Video",
    textPlaceholder: "Enter text here",
    datePlaceholder: "Enter date here",
    OperationsDesc: "Operations description",
    RadiologyDesc: "Radiology description",
    LabTestsDesc: "Lab Tests description",
    MedicationsDesc: "Medications description",
    DiagnosisDesc: "Diagnosis description",
    SymptomsDesc: "Symptoms description",
    saveJson: "saveJson",
    Image: "Image",
    Video:"Video",
    Dosage: "Dosage"
  },
  ar: {
    personalCode: "الرمز الشخصي:",
    name: "الاسم:",
    nationalId: "الرقم القومي:",
    occupation: "الوظيفة:",
    dob: "تاريخ الميلاد:",
    phone: "رقم الهاتف:",
    closeContact: "هاتف شخص قريب:",
    governorate: "المحافظة:",
    medicalCondition: "الحالة المرضية:",
    patientDetails: "تفاصيل المريض",
    medicalHistory: "التاريخ الطبي",
    date: "التاريخ",
    diagnosis: "التشخيص",
    treatment: "العلاج",
    medication: "الدواء",
    dose: "الجرعة",
    notes: "ملاحظات",
    previous: "السابقه",
    next: "التاليه",
    printTable: "طباعة الجدول",
    details: "التفاصيل",
    showHide: "اظهار/اخفاء",

    // Dialog-specific
    addMedicalData: "إضافة بيانات المريض",
    patientInfo: "معلومات المريض",
    Operations: "العمليات",
    Radiology: "الأشعة",
    "Lab Tests": "تحاليل المختبر",
    Medications: "الأدوية",
    Diagnosis: "التشخيص",
    Symptoms: "الأعراض",
    addTextBtn: "إضافة نص",
    addImageBtn: "إضافة صورة",
    addVideoBtn: "إضافة فيديو",
    textPlaceholder: "أدخل النص هنا",
    datePlaceholder: "أدخل التاريخ هنا",
    OperationsDesc: "وصف العمليات",
    RadiologyDesc: "وصف الأشعة",
    LabTestsDesc: "وصف التحاليل",
    MedicationsDesc: "وصف الأدوية",
    DiagnosisDesc: "وصف التشخيص",
    SymptomsDesc: "وصف الأعراض",
    saveJson: "حفظ الملف",
    Image: "صوره",
    Video: "فيديو",
    Dosage: "الجرعه"
  }
};

const dropdownToggle = document.querySelector('.dropdown-toggle');

function changeLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        let oldPlaceholder = el.placeholder.replace(/\d+$/, "").trim();
        let numberMatch = el.placeholder.match(/\d+$/);
        let newText = translations[lang][key] || oldPlaceholder;
        if (numberMatch) {
            newText += " " + numberMatch[0];
        }
        el.placeholder = newText;
    } else {
        let oldText = el.textContent.replace(/\d+$/, "").trim();
        let numberMatch = el.textContent.match(/\d+$/);
        let newText = translations[lang][key] || oldText;
        if (numberMatch) {
            newText += " " + numberMatch[0];
        }
        el.textContent = newText;
    }
  });
  document.body.dir = (lang === "ar") ? "rtl" : "ltr";
  document.getElementById("langContainer").classList.toggle("ms-auto", lang === "en");
  document.getElementById("langContainer").classList.toggle("me-auto", lang === "ar");
  if (lang === "ar") {
    document.body.setAttribute("dir", "rtl");
    document.documentElement.lang = "ar";
    dropdownToggle.style.setProperty('--arrow-right', 'auto');
    dropdownToggle.style.setProperty('--arrow-left', '10px');
    document.querySelectorAll(".dropdown-menu div").forEach(el => {
      el.style.textAlign = "right";
    });
  } else {
    document.body.setAttribute("dir", "ltr");
    document.documentElement.lang = "en";
    dropdownToggle.style.setProperty('--arrow-right', '10px');
    dropdownToggle.style.setProperty('--arrow-left', 'auto');
    document.querySelectorAll(".dropdown-menu div").forEach(el => {
      el.style.textAlign = "left";
    });
  }
  localStorage.setItem("language", lang);
}

const dropdown = document.querySelector('.dropdown');
const toggle = document.getElementById('selectedLang');
const menu = document.getElementById('languageMenu');

dropdown.addEventListener('mouseenter', () => {
  menu.classList.add('show');
});
dropdown.addEventListener('mouseleave', () => {
  menu.classList.remove('show');
});
dropdown.addEventListener('focusin', () => {
  menu.classList.add('show');
});
dropdown.addEventListener('focusout', () => {
  menu.classList.remove('show');
});

menu.querySelectorAll('div').forEach(item => {
  item.addEventListener('click', () => {
    const lang = item.dataset.value;
    toggle.textContent = item.textContent;
    menu.classList.remove('show');
    changeLanguage(lang);
    localStorage.setItem("language", lang);
  });
});

const savedLang = localStorage.getItem("language") || "en";
toggle.textContent = savedLang === "ar" ? "العربية" : "English";
changeLanguage(savedLang);

function onElementsIncrease(count) {
    changeLanguage(localStorage.getItem("language") || "en");
}

let lastCount = document.querySelectorAll("[data-key]").length;
const observer = new MutationObserver(() => {
    const currentCount = document.querySelectorAll("[data-key]").length;
    if (currentCount > lastCount) {
        onElementsIncrease(currentCount);
    }
    lastCount = currentCount;
});
observer.observe(document.body, { childList: true, subtree: true });

