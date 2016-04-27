//親はNavigation.react
//メニューアイコンのクリックの反応について書いてる
//actionはProjectSelectorStoreに送ってる
const
    NavigationViewActionCreator = require('../actions/NavigationViewActionCreator'),
    React = require('react'),
    jade = require('react-jade'),
    Router = require('react-router'),
    Link = Router.Link,
    Route = Router.Route,

    menuIcon = jade.compileFile(__dirname + '/../templates/MenuIcon.jade');

const MenuIcon = React.createClass({
//Navigation.jadeにあるactとsrc
  propTypes : {
    act   : React.PropTypes.string.isRequired,
    src   : React.PropTypes.string.isRequired,
  },

  getInitialState: function(){
    return {
    };
  },

  getDefaultProps: function(){
    return {
    };
  },

  render : menuIcon,

  onclick : function(){
    NavigationViewActionCreator.menuSelect(this.props.act);
  },

  componentWillMount : function(){
    return {
    };
  },

  componentDidMount : function (){

  },

  componentWillUpdate : function(){
    return {
    };
  },

  componentDidUpdate : function(){
    return {
    };
  },

  componentWillUnmount : function(){
    return {
    };
  },

});

module.exports = MenuIcon;
