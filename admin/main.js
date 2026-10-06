    document.addEventListener("DOMContentLoaded", function () {
      // --------- Language & Theme Setup ---------
        const btn = document.getElementById("themeToggle");
        const dropdownToggle = document.querySelector('.dropdown-toggle');

      // Translations
      const translations = {
        en: {
          dashboard: "Dashboard",
          patients: "Patients",
          appointments: "Appointments",
          staff: "Staff",
          billing: "Billing",
          inventory: "Inventory",
          reports: "Reports",
          settings: "Settings",
          overview: "Dashboard Overview",
          section1: "📊 Full patient details here...",
          section2: "📅 Upcoming appointments in detail...",
          section3: "💰 Pending bills with payment level...",
          section4: "💵 Additional bills and payment details..."
        },
        ar: {
          dashboard: "لوحة التحكم",
          patients: "المرضى",
          appointments: "المواعيد",
          staff: "الموظفين",
          billing: "الفواتير",
          inventory: "المخزون",
          reports: "التقارير",
          settings: "الإعدادات",
          overview: "نظرة عامة على لوحة التحكم",
          section1: "📊 تفاصيل المرضى الكاملة هنا...",
          section2: "📅 المواعيد القادمة بالتفصيل...",
          section3: "💰 فواتير معلقة مع مستوى الدفع...",
          section4: "💵 فواتير إضافية وتفاصيل الدفع..."
        }
      };

      function changeLanguage(lang) {
        document.querySelector('[data-page="dashboard"]').innerHTML = `<i class="fa-solid fa-gauge me-2"></i> ${translations[lang].dashboard}`;
        document.querySelector('[data-page="patients"]').innerHTML = `<i class="fa-solid fa-user-group me-2"></i> ${translations[lang].patients}`;
        document.querySelector('[data-page="appointments"]').innerHTML = `<i class="fa-solid fa-calendar-check me-2"></i> ${translations[lang].appointments}`;
        document.querySelector('[data-page="staff"]').innerHTML = `<i class="fa-solid fa-users me-2"></i> ${translations[lang].staff}`;
        document.querySelector('[data-page="billing"]').innerHTML = `<i class="fa-solid fa-file-invoice-dollar me-2"></i> ${translations[lang].billing}`;
        document.querySelector('[data-page="inventory"]').innerHTML = `<i class="fa-solid fa-boxes-stacked me-2"></i> ${translations[lang].inventory}`;
        document.querySelector('[data-page="reports"]').innerHTML = `<i class="fa-solid fa-chart-line me-2"></i> ${translations[lang].reports}`;
        document.querySelector('[data-page="settings"]').innerHTML = `<i class="fa-solid fa-gear me-2"></i> ${translations[lang].settings}`;

        document.querySelector("#dashboard h4").textContent = translations[lang].overview;
        document.getElementById("section1").textContent = translations[lang].section1;
        document.getElementById("section2").textContent = translations[lang].section2;
        document.getElementById("section3").textContent = translations[lang].section3;
        document.getElementById("section4").textContent = translations[lang].section4;

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

      // Theme toggle
      btn.addEventListener("click", function () {
        if (document.body.classList.contains("dark-mode")) {
          document.body.classList.remove("dark-mode");
          btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
          localStorage.setItem("theme", "light");
        } else {
          document.body.classList.add("dark-mode");
          btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
          localStorage.setItem("theme", "dark");
        }
      });

      // Sidebar nav link click
      document.querySelectorAll(".sidebar .nav-link").forEach(link => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          document.querySelectorAll(".sidebar .nav-link").forEach(el => el.classList.remove("active"));
          this.classList.add("active");
          document.querySelectorAll(".page-section").forEach(section => section.classList.add("d-none"));
          let page = this.getAttribute("data-page");
          document.getElementById(page).classList.remove("d-none");
        });
      });

      // Cards toggle sections
      const cards = document.querySelectorAll('#dashboard .card');
      const sections = document.querySelectorAll('.toggle-section');

      cards.forEach(card => {
        card.addEventListener('click', () => {
          const targetId = card.getAttribute('data-target');
          const targetSection = document.getElementById(targetId);

          if (card.classList.contains('active')) {
            card.classList.remove('active');
            targetSection.classList.remove('active');
          } else {
            cards.forEach(c => c.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            card.classList.add('active');
            targetSection.classList.add('active');
          }
        });
      });

      // Restore theme
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else {
        btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }

      // ==== Custom dropdown for language ====
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

      // Restore language
      const savedLang = localStorage.getItem("language") || "en";
      toggle.textContent = savedLang === "ar" ? "العربية" : "English";
      changeLanguage(savedLang);
    });
    