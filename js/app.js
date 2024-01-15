//! Edit & view toggler

const edit_btn = document.querySelector("[data-toggle-edit]");
const view_btn = document.querySelector("[data-toggle-view]");

const module_view_arr = document.querySelectorAll("[data-module-view]");
const module_edit_arr = document.querySelectorAll("[data-module-edit]");

// if edit mode is in the url then toggle edit mode
if (window.location.href.includes("edit")) {
  toggleClasses(document.body, ["edit"], []);
  toggleClasses(edit_btn, ["text-secondary", "bg-main"], ["text-main", "bg-orange"]);
  toggleClasses(view_btn, ["text-main", "bg-orange"], ["text-secondary", "bg-main"]);

  for (let i = 0; i < module_view_arr.length; i++) {
    toggleClasses(module_view_arr[i], ["hidden"], []);
    toggleClasses(module_edit_arr[i], [], ["hidden"]);
  }
}

// Toggle edit mode in tailwind
function toggleClasses(element, classesToAdd, classesToRemove) {
  classesToRemove.forEach((cls) => element.classList.remove(cls));
  classesToAdd.forEach((cls) => element.classList.add(cls));
}

edit_btn.addEventListener("click", () => {
  toggleClasses(document.body, ["edit"], []);
  toggleClasses(edit_btn, ["text-secondary", "bg-main"], ["text-main", "bg-orange"]);
  toggleClasses(view_btn, ["text-main", "bg-orange"], ["text-secondary", "bg-main"]);

  for (let i = 0; i < module_view_arr.length; i++) {
    toggleClasses(module_view_arr[i], ["hidden"], []);
    toggleClasses(module_edit_arr[i], [], ["hidden"]);
  }
});

view_btn.addEventListener("click", () => {
  toggleClasses(document.body, ["edit"], []);
  toggleClasses(edit_btn, ["text-main", "bg-orange"], ["text-secondary", "bg-main"]);
  toggleClasses(view_btn, ["text-secondary", "bg-main"], ["text-main", "bg-orange"]);

  for (let i = 0; i < module_edit_arr.length; i++) {
    toggleClasses(module_edit_arr[i], ["hidden"], []);
    toggleClasses(module_view_arr[i], [], ["hidden"]);
  }
});

//! Add new field to a module

const tag_module = document.querySelector('[data-module="tags"]');
// query the data-add-field inside the tags module
let add_field_btn_arr = document.querySelectorAll("[data-add-field]");
let remove_field_btn_arr = document.querySelectorAll("[data-delete]");
let min_field_num = 1;

addField();

function addField() {
  add_field_btn_arr.forEach((btn) => {
    btn.addEventListener("click", () => {
      // get the parent data-module
      const parent_module = btn.closest("[data-module]");

      // query the data-field inside the tags module
      const field = parent_module.querySelector("[data-module-edit-field]");
      const fieldset = parent_module.querySelector("[data-module-fieldset]");

      // create a new field but without the value and do not clone it
      const new_field = field.cloneNode(true);
      // clear the value of the new field
      console.log(new_field);
      new_field.value = "";

      // append the new field to the tags module
      fieldset.appendChild(new_field);
      // update the remove_field_btn
    });
  });
}
