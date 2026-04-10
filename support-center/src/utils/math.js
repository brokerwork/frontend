function add(a, b) {
  let c, d, e;

  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }

  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }

  e = Math.pow(10, Math.max(c, d));

  return (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
  let c, d, e;

  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }

  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }

  e = Math.pow(10, Math.max(c, d));

  return (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
  let c = 0, d = a.toString(), e = b.toString();

  try {
    c += d.split('.')[1].length;
  } catch (f) {} // eslint-disable-line no-empty

  try {
    c += e.split('.')[1].length;
  } catch (f) {} // eslint-disable-line no-empty

  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
}

function div(a, b) {
  let c, d, e = 0, f = 0;

  try {
    e = a.toString().split('.')[1].length;
  } catch (g) {} // eslint-disable-line no-empty

  try {
    f = b.toString().split('.')[1].length;
  } catch (g) {} // eslint-disable-line no-empty

  c = Number(a.toString().replace('.', ''));
  d = Number(b.toString().replace('.', ''));
  
  return mul(c / d, Math.pow(10, f - e));
}

function mod(a, b) {
  let c, d, e = 0, f = 0, times = 1;
  try {
    e = a.toString().split('.')[1].length;
  } catch (g) {} // eslint-disable-line no-empty

  try {
    f = b.toString().split('.')[1].length;
  } catch (g) {} // eslint-disable-line no-empty
  times = Math.pow(10, Math.max(e, f));
  c = a * times;
  d = b * times;
  return _mod(c, d);
}
function _mod(x, y) {
  if (y > 0) {
    return x - y * Math.floor(x / y);
  } else if (y === 0) {
    return x;
  } else {
    throw new Error('Cannot calculate mod for a negative divisor');
  }
}

export default {
  add,
  sub,
  mul,
  div,
  mod
};