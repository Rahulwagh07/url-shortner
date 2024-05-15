export const formattedDate = (date) => {
  return date ? new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : '';
};

// TO Format startDate and endDate as 'YYYY-MM-DD'
export const formatDate = (date) => {
  return date ? new Date(date).toISOString().split('T')[0] : '';
};

export const formatDateString = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};