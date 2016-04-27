var React = require('react');
var Router = require('react-router');
global.$ = global.jQuery = require('jquery');
require('jquery-ujs');
global.gensym = function(){
  var sym = "";
  for(i = 0; i < 10; i++){
    sym += "1234567890abcdefghijklmnopqrstuvwxyz"[Math.ceil(Math.random() * 34)];
  }
  return sym;
};
