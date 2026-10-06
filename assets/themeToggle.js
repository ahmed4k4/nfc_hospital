// تغيير الثيم
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("themeToggle");

  btn.addEventListener("click", function () {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem("theme", "dark");
    }
  });
        // Restore theme
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else {
        btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
});
