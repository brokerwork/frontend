const compareObject = (a, b) => {
  const aProps = Object.keys(a);
  const bProps = Object.keys(b);
  const aValues = Object.values(a);
  const bValues = Object.values(b);

  if (!aProps.length && bProps.length && bValues.every(_b => !_b)) {
    return true;
  }

  if (!bProps.length && aProps.length && aValues.every(_a => !_a)) {
    return true;
  }

  if (aProps.length !== bProps.length) {
    return false;
  }

  if (!aProps.every(prop => bProps.some(_prop => prop === _prop))) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    if (a[propName] != b[propName]) {
      return false;
    }
  }

  return true;
};

export default compareObject;
