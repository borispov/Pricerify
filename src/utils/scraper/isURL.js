module.exports = function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?') // protocol
  return pattern.test(str);
}