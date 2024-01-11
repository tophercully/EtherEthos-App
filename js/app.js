//! Edit & view toggler

const edit_btn = document.querySelector("[data-toggle-edit]");
const view_btn = document.querySelector("[data-toggle-view]");

const module_view_arr = document.querySelectorAll("[data-module-view]");
const module_edit_arr = document.querySelectorAll("[data-module-edit]");

// Toggle edit mode in tailwind
edit_btn.addEventListener("click", () => {
  document.body.classList.toggle("edit");
  edit_btn.classList.remove("text-main");
  edit_btn.classList.remove("bg-orange");
  edit_btn.classList.add("text-secondary");
  edit_btn.classList.add("bg-main");
  view_btn.classList.remove("text-secondary");
  view_btn.classList.remove("bg-main");
  view_btn.classList.add("text-main");
  view_btn.classList.add("bg-orange");

  for (let i = 0; i < module_view_arr.length; i++) {
    module_view_arr[i].classList.add("hidden");
    module_edit_arr[i].classList.remove("hidden");
  }
});

// Toggle view mode in tailwind
view_btn.addEventListener("click", () => {
  document.body.classList.toggle("edit");
  edit_btn.classList.remove("text-secondary");
  edit_btn.classList.remove("bg-main");
  edit_btn.classList.add("text-main");
  edit_btn.classList.add("bg-orange");
  view_btn.classList.remove("text-main");
  view_btn.classList.remove("bg-orange");
  view_btn.classList.add("text-secondary");
  view_btn.classList.add("bg-main");

  for (let i = 0; i < module_edit_arr.length; i++) {
    module_edit_arr[i].classList.add("hidden");
    module_view_arr[i].classList.remove("hidden");
  }
});
