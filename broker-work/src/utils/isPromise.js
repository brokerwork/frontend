export default p => {
  return p && typeof p.then === 'function';
};
