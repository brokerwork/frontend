let sig:any;
let OssHelper = {
  setSignature(s:any) {
    sig = s;
  },
  getSignature() {
    return sig;
  },
  getFileUrlPrefix() {
    if ( sig && sig.host && sig.dir ) {
      return sig.host + '/' + sig.dir
    }
  }
}

export default OssHelper;
