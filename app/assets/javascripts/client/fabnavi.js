global.$ = global.jQuery = require('jquery');
require('jquery-ujs');
require('./components/FabnaviApp');


global.gensym = function(){
  let sym = "";
  let i;
  for(i = 0; i < 10; i++){
    sym += "1234567890abcdefghijklmnopqrstuvwxyz"[Math.ceil(Math.random() * 34)];
  }
  return sym;
};
