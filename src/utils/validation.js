function isNull(value) {
  return value === null;
}

function isUndefined(value) {
  return value === undefined;
}

function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

function isNullOrUndefined(value) {
  return value === null || value === undefined;
}

function isDateValid(date) {
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
}

module.exports = {
  isNull,
  isUndefined,
  isNullOrUndefined,
  isNumber,
  isDateValid,
};
