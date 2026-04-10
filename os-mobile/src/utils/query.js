class QueryLocation {
  get(key) {
    let search = location.hash.split('?').pop();
    const arr = search.split('&');
    const map = {};
    arr.forEach(el => {
      const arr = el.split('=');
      map[arr.shift()] = arr.pop();
    });
    return map[key];
  }
}

export default new QueryLocation();
