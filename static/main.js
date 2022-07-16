let config = await framework.load("config.js");

if (!(await config.checkPwd(cookie.pwd))) location.href = "login";

let blockNames = await config.listBlocks(cookie.pwd);

let table = document.getElementById("table");

for (let blockName of blockNames) {
  let localName = blockName;
  let wrap = document.createElement("div");
  wrap.className = "tableEntry";
  let name = document.createElement("a");
  name.innerText = blockName;
  wrap.appendChild(name);
  wrap.addEventListener("click", () => {
    openEdit(localName);
  });
  table.appendChild(wrap);
}

const openEdit = (name) => {
  cookie.name = name;
  location.pathname += "edit";
};

const createNew = async () => {
  await new Promise((r) => setTimeout(r, 500));
  let name = prompt("Name");
  await config.createBlock(cookie.pwd, name);
  openEdit(name);
};

window.createNew = createNew;
