export let saveBanks = data => {
  localStorage.setItem('BANKS', JSON.stringify(data));
};
export let fetchBanks = data => {
  return JSON.parse(localStorage.getItem('BANKS'));
};
export let setBanksMap = banks => {
  let map = {};
  banks.forEach(el => {
    map[el.value] = el.label;
  });
  return map;
};
