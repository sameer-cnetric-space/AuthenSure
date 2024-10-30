const { v4: uuidv4 } = require("uuid");

const generateUUID = (prefix = "") => {
  const uuid = uuidv4(); // Generate a random UUID (v4)
  return `${prefix}${uuid}`;
};

module.exports = generateUUID;
