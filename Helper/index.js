const helper = {
  queryToObject(str){
    if(str.split("?").length < 2) return {}; 
    var query = str.replace("?", "").replace(/\+/g, ' ').split("&");
    query = query.map((a) => { return a += a.indexOf("=") == -1 ? "=" : "" }).join("&");
    if(!query) return {};
    return JSON.parse('{"' + decodeURIComponent(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  },
  objectToQuery(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  },
  putStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value))
  },
  getStorage(key, def = ""){
    var item = localStorage.getItem(key)
    if(!item) return def
    return JSON.parse(localStorage.getItem(key))
  },
  delStorage(key){
    delete localStorage.removeItem(key)
  },
  putSession(key, value){
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  getSession(key, def = ""){
    var item = sessionStorage.getItem(key)
    if(!item) return def
    return JSON.parse(sessionStorage.getItem(key))
  },
  delSession(key){
    delete sessionStorage.removeItem(key)
  },
  putCookie(name,value,second) {
    var expires = "";
    if (second) {
      var date = new Date();
      date.setTime(date.getTime() + (second*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (JSON.stringify(value) || "")  + expires + "; path=/";
  },
  getCookie(name, def = "") {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0){
        var val = c.substring(nameEQ.length,c.length)
        try{
          return JSON.parse(val)
        }catch{
          return val
        }
      }
    }
    return def;
  },
  delCookie(name) {   
    document.cookie = name+'=; expires='+(new Date()).toUTCString()+'; path=/';  
  },
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
  
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
    
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
    
      var byteArray = new Uint8Array(byteNumbers);
    
      byteArrays.push(byteArray);
    }
  
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  },
  delay: (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })(),
  interval(callback, speed, timeout){
    var time = 0;
    var i = setInterval(()=>{
      time += speed;
      try{
        callback()
      }catch(e){
        // statement
      }
      if(time==timeout) clearInterval(i);
    }, speed);
    return new Promise((resolve)=>{ setTimeout(()=>{ resolve }, timeout) })
  },
  yearCopy(year){
    if(year != moment().year()) return year+" - "+moment().year()
    return year
  },
  tryPlugin(varname, timeout = 5000){
    return new Promise((resolve)=>{
      let strEval = "typeof "+varname+" != 'undefined'"
      if(eval(strEval)) return resolve()
      let timeid = setInterval(()=>{ 
        if(eval(strEval)){ clearInterval(timeid); resolve() }
      }, 500)
      setTimeout(() => { clearInterval(timeid) }, timeout)
    })
  }
}

export default helper