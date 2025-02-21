const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");
const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
const confirmPassword = document.querySelector("#confirmPassword");

togglePassword.addEventListener("click", () => {
  const type = password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
});

// toggleConfirmPassword.addEventListener("click", () => {
//   const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
//   confirmPassword.setAttribute("type", type);
// });