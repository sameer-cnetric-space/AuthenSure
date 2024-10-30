const formatDate = (date) => {
  if (!date) return ""; // Return empty string if the date is not provided
  return new Date(date).toISOString().split("T")[0]; // Extract 'YYYY-MM-DD'
};
module.exports = { formatDate };
