// Utility function to compare two strings, ignoring case and trimming extra spaces
const compareStrings = (str1, str2) => {
  if (!str1 || !str2) return false;
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
};

module.exports = { compareStrings };
