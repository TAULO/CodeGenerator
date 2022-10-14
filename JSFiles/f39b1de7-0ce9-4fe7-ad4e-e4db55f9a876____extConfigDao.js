const prisma = require('../prisma');

const addCustomExtConfig = async reqData => {
  const { extension, tag } = reqData;
  await prisma.$queryRaw`
  INSERT INTO extensions (extension_name, tag)
  VALUES (${extension}, ${tag})
  `;
};

const getFixExtConfig = async () => {
  const result = await prisma.$queryRaw`
  SELECT * FROM extensions
  WHERE tag = 'fix'
  `;
  result.map(el => {
    el.extensionName = el.extension_name;
    el.isBanned = el.is_banned;
    delete el.is_banned;
    delete el.extension_name;
  });
  return result;
};

const getCustomExtConfig = async () => {
  const result = await prisma.$queryRaw`
  SELECT * FROM extensions
  WHERE tag = 'custom'
  `;
  result.map(el => {
    el.extensionName = el.extension_name;
    el.isBanned = el.is_banned;
    delete el.is_banned;
    delete el.extension_name;
  });
  return result;
};

const deleteCustomExtConfig = async reqData => {
  const { extension } = reqData;
  await prisma.$queryRaw`
  DELETE FROM extensions
  WHERE extension_name = ${extension}
  `;
};

const getExtStatusByExtName = async reqData => {
  const { extension } = reqData;
  const result = await prisma.$queryRaw`
  SELECT is_banned FROM extensions
  WHERE extension_name = ${extension}
  `;
  result.map(el => {
    el.isBanned = el.is_banned;
    delete el.is_banned;
  });
  return result;
};

const getExtNameByExtName = async reqData => {
  const { extension } = reqData;
  const result = await prisma.$queryRaw`
  SELECT extension_name FROM extensions
  WHERE extension_name = ${extension}
  `;
  result.map(el => {
    el.extensionName = el.extension_name;
    delete el.extension_name;
  });
  return result;
};

const toggleOffExt = async reqData => {
  const { extension } = reqData;
  await prisma.$queryRaw`
  UPDATE extensions
  SET is_banned=0
  WHERE extension_name = ${extension}
  `;
};

const toggleOnExt = async reqData => {
  const { extension } = reqData;
  await prisma.$queryRaw`
  UPDATE extensions
  SET is_banned=1
  WHERE extension_name = ${extension}
  `;
};

const getAllExtName = async () => {
  const result = await prisma.$queryRaw`
  SELECT extension_name FROM extensions
  WHERE is_banned = 1
  `;
  const newResult = result.map(el => el.extension_name);
  return newResult;
};

const resetAllConfig = async () => {
  await prisma.$queryRaw`
  DELETE FROM extensions
  WHERE tag = 'custom'
  `;
  await prisma.$queryRaw`
  UPDATE extensions
  SET is_banned=0
  WHERE tag = 'fix'
  `;
};

module.exports = {
  addCustomExtConfig,
  getFixExtConfig,
  getCustomExtConfig,
  deleteCustomExtConfig,
  getExtStatusByExtName,
  getExtNameByExtName,
  toggleOffExt,
  toggleOnExt,
  getAllExtName,
  resetAllConfig,
};
