let config = await framework.load("config.js");

let block = await config.loadBlock(cookie.pwd, cookie.name);
let attributes = await config.blockAttributes(cookie.pwd);

document.getElementById("name").innerText = cookie.name;

let inputWrap = document.getElementById("inputWrap");

const generateAttribute = async (attribute) => {
  let matchingOverwrite;

  for (let overwrite of block.overwrites) {
    if (overwrite.overwrite == attribute.replace) {
      matchingOverwrite = overwrite;
    }
  }

  if (!matchingOverwrite) {
    matchingOverwrite = {
      data: "",
      overwrite: attribute.replace,
    };
    block.overwrites.push(matchingOverwrite);
  }

  let input = document.createElement("m-text-input");
  input.setAttribute("placeholder", attribute.name);
  input.setAttribute(
    "value",
    matchingOverwrite.data
      ? matchingOverwrite.data
      : attribute.default
      ? attribute.default
      : ""
  );

  inputWrap.appendChild(input);

  input.addEventListener("change", () => {
    matchingOverwrite.data = input.component.value;
  });

  return { attribute, overwrite: matchingOverwrite, input };
};

let attributesGenerated = [];

for (let attribute of attributes) {
  attributesGenerated.push(generateAttribute(attribute));
}

const deleteBlock = async () => {
  await new Promise((r) => setTimeout(r, 500));
  await config.deleteBlock(cookie.pwd, cookie.name);
  location.pathname += "../";
};

window.deleteBlock = deleteBlock;

const saveBlock = async () => {
  await new Promise((r) => setTimeout(r, 500));
  await config.saveBlock(cookie.pwd, block);
  await config.saveConfigFile(cookie.pwd);
  location.pathname += "../";
};

window.saveBlock = saveBlock;
