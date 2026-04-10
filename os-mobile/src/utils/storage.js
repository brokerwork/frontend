class Storage {
  set(key, val) {
    localStorage.setItem(key, val);
  }
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      return localStorage.getItem(key);
    }
  }
  remove(key) {
    localStorage.removeItem(key);
  }
}
export const TOKEN = "TOKEN";
export default new Storage();
