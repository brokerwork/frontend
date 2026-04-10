let VenderHelper = {
  MT4: 'mt4',
  MT5: 'mt5',
  setVender( v:string ) {
    this.vender = v;
  },
  getVender() {
    return this.vender;
  }
};

export default VenderHelper;
