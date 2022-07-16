let config = await framework.load("config.js");

let input = document.getElementById("input");

window.login = async () => {
  await new Promise((r) => setTimeout(r, 500));
  if (await config.checkPwd(input.component.value)) location.pathname += "../";
  input.component.value = "";
};
