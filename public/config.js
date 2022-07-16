import config from "@proxtx/config";
import fs from "fs/promises";
import { exec } from "child_process";

export const checkPwd = (pwd) => {
  if (pwd == config.pwd) return true;
  return false;
};

export const saveConfigFile = async (pwd) => {
  if (!checkPwd(pwd)) return;
  let blocks = await loadBlocks();
  let blockTemplate = await loadTextFile("block.txt");
  let defaultFile = await loadTextFile("defaultFile.txt");

  let finalBlocksConfig = "";
  for (let block of blocks) {
    let blockData = blockTemplate;
    for (let overwrite of block.overwrites) {
      blockData = blockData.replace(overwrite.overwrite, overwrite.data);
    }
    finalBlocksConfig += blockData;
  }

  let finalConfigFile = defaultFile.replace("$customBlocks", finalBlocksConfig);
  await saveTextFile(config.resultFile, finalConfigFile);

  exec(
    config.restartNginx,
    (error) => {
      console.log(error);
    },
    (stdOut) => {
      console.log(stdOut);
    },
    (stdErr) => {
      console.log(stdErr);
    }
  );
};

export const loadBlock = async (pwd, name) => {
  if (!checkPwd(pwd)) return;
  let blocks = await loadBlocks();
  for (let block of blocks) {
    if (block.name == name) return block;
  }
};

export const saveBlock = async (pwd, block) => {
  if (!checkPwd(pwd)) return;
  let blocks = await loadBlocks();
  for (let blockIndex in blocks) {
    if (blocks[blockIndex].name == block.name) blocks[blockIndex] = block;
  }

  await saveBlocks(blocks);
};

export const createBlock = async (pwd, name) => {
  if (!checkPwd(pwd)) return;
  let blocks = await loadBlocks();
  blocks.push({
    name,
    overwrites: [],
  });

  await saveBlocks(blocks);
};

export const deleteBlock = async (pwd, name) => {
  if (!checkPwd(pwd)) return;
  let blocks = await loadBlocks();
  for (let blockIndex in blocks) {
    if (blocks[blockIndex].name == name) blocks.splice(blockIndex, 1);
  }

  await saveBlocks(blocks);
};

export const listBlocks = async (pwd) => {
  if (!checkPwd(pwd)) return;
  let blocks = await loadBlocks();
  let blockNames = [];
  for (let block of blocks) {
    blockNames.push(block.name);
  }

  return blockNames;
};

export const blockAttributes = (pwd) => {
  if (!checkPwd(pwd)) return;
  return config.replace;
};

const loadBlocks = async () => {
  return JSON.parse(await fs.readFile("blocks.json", "utf-8")).blocks;
};

const saveBlocks = async (blocks) => {
  await fs.writeFile("blocks.json", JSON.stringify({ blocks }));
};

const loadTextFile = async (name) => {
  return await fs.readFile(name, "utf-8");
};

const saveTextFile = async (name, data) => {
  await fs.writeFile(name, data);
};
