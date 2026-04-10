export const lessThan = otherField =>
  (value, previousValue, allValues) =>
    parseFloat(value) < parseFloat(allValues[otherField]) ? value : previousValue;

export const greaterThan = otherField =>
  (value, previousValue, allValues) =>
    parseFloat(value) > parseFloat(allValues[otherField]) ? value : previousValue;

export const lessEqualThan = otherField =>
  (value, previousValue, allValues) =>
    parseFloat(value) <= parseFloat(allValues[otherField]) ? value : previousValue;

export const greaterEqualThan = otherField =>
  (value, previousValue, allValues) =>
    parseFloat(value) >= parseFloat(allValues[otherField]) ? value : previousValue;
