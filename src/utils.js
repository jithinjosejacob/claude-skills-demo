const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError('Argument must be a valid Date object');
  }
  return date.toISOString();
};

const parseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON:', error);
    return null;
  }
};

module.exports = { formatDate, parseJSON };
