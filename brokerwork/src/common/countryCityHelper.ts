let countryCityMap: any = {};
let CountryCityHelper = {
  setCountryCity(ccArray: any) {
    if (ccArray) {
      ccArray.forEach((ccItem: any) => {
        countryCityMap[ccItem.id] = ccItem.value
      })
    }
  },
  getText(id: string) {
    return countryCityMap[id];
  }
}

export default CountryCityHelper;
