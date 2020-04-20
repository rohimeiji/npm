const moment = require("moment")
moment.locale("id")

Number.prototype.sigFig = function($sigFigs = 3) {
  var $exponent = Math.floor(Math.log10(Math.abs(this))+1);
  var $significand = Math.round((this
    / Math.pow(10, $exponent))
    * Math.pow(10, $sigFigs))
    / Math.pow(10, $sigFigs);
  return $significand * Math.pow(10, $exponent);
}
Number.prototype.currency = function($sigFigs = 3){
  //SI prefix symbols
  if(!this)return;
  var $units = ['', ' RB', ' JT', ' M', ' T', ' P', ' E'];
  var $index = Math.floor(Math.log10(this)/3);
  var value = $index ? this/Math.pow(1000, $index) : this;
  return Math.round(value.sigFig($sigFigs)) + $units[$index];
}
Number.prototype.format = function(country = "id-ID", fractionDigit = 2){
  return new Intl.NumberFormat(country,{maximumFractionDigits:fractionDigit}).format(this)
}
String.prototype.format = function(country, fractionDigit){
  return parseFloat(this.toString()).format(country, fractionDigit)
}
Number.prototype.bytesToSize = function(){
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (this == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(this) / Math.log(1024)));
  return Math.round(this / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
String.prototype.bytesToSize = function () {
  return parseInt(this).bytesToSize();
}
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}
String.prototype.htmlDecode = function(){
  if(this=="") return "";
  var e = document.createElement('div');
  e.innerHTML = this;
  return e.childNodes[0].nodeValue;
}
File.prototype.toImage = function(callback){
  var image = new Image
  var fr = new FileReader()
  fr.onload =  ()=>{
    image.onload = ()=>{
      if(typeof callback != "undefined") callback(image)
      this.image = image
    }
    image.src = fr.result
  }
  fr.readAsDataURL(this)
}
function dates(date, format, from){
  if(format == "date") format = "YYYY-MM-DD"
  if(format == "datetime") format = "YYYY-MM-DD HH:mm:ss"
  if(format == "time") format = "HH:mm:ss"
  if(format == "format") format = "DD MMMM YYYY"
  if(format == "format2") format = "DD MMMM YYYY, HH:mm"
  if(format == "format3") format = "dddd, DD MMMM YYYY, HH:mm"
  var dateString = moment(date).format(format)
  if(from) dateString = moment(date, from).format(format)
  return dateString != "Invalid date" ? dateString : ""
}
String.prototype.dates = function(format, from){
  return dates(this, format, from)
}
function currency(v){
  return (v ? v.toString() : "0").format()
}
String.prototype.wordLength = function(){
  if(!this.length) return 0
  return this.replaceAll(/\s+/g," ").trim().split(' ').length;
}
String.prototype.slugify = function(){
  return this.toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
String.prototype.limitChar = function(limit, end = "..."){
  if(this.length<=limit) return this
  return this.substr(0,limit)+end
}
String.prototype.limitWord = function(limit, end = "..."){
  var str = this.stripTags().replace(/\s+/g, " ").trim().split(" ").splice(0,limit).join(" ")
  if(this.wordLength()<=limit) return str
  return str+end
}
String.prototype.stripTags = function(){
  var div = document.createElement("div");
  div.innerHTML = this;
  return div.textContent || div.innerText || "";
}
String.prototype.toValue = function(){
  return parseFloat(this.replace(/\./g, '').replace(/,/g, '.'))
}
Number.prototype.toValue = function(){
  return parseFloat(this)
}