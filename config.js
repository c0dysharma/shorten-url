const config = {
  ip: '0.0.0.0',
  port: process.env.PORT || 3000,
  protocols: ['http', 'https', 'ftp', 'magnet'],
  validatURL: (res) => {
    if (Object.keys(res).length == 0) return false; // if nothing is passed
    const keys = Object.keys(res)
    for (let key of keys) {
      var flag = false;
      // if (!key.startsWith('/')) break; // if value is not a tail
      // if value is not an link      
      for (let prot of config.protocols) {
        if (res[key].startsWith(prot))
          flag = true
      }
      if (!flag) break
    }
    return flag;
  }
}
export default config