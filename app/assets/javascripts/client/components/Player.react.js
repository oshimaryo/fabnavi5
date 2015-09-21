var React = require('react');
var jade = require('react-jade');

var ProjectStore = require('../stores/ProjectStore');
var MainView = require('../player/MainView');
var ProjectActionCreator = require('../actions/ProjectActionCreator');

var Router = require('react-router'); 
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var CalibrateController = require('../player/CalibrateController');
var player = jade.compileFile(__dirname + '/../templates/Player.jade');
var WebAPIUtils = require('../utils/WebAPIUtils');

var _current_file = null;

var Player = React.createClass({
  render:  player,

  contextTypes: {
      router: React.PropTypes.func
  },

  getStateFromStores : function getStateFromStores() {
    return {
     project : ProjectStore.getProject(),
     page : ProjectStore.getCurrentPage(),
    };
  },

  _onChange : function () {
    console.log("Emit player component");
    this.setState(this.getStateFromStores());
  },
  getInitialState: function() {
    return this.getStateFromStores();
  },

  getDefaultProps: function() {
     return {
     };
   },

  handleSubmit : function( event ){
    console.log(event);
    if( _current_file == null ) return ;
    WebAPIUtils.uploadFile( _current_file );
  },

  handleFile : function( event ){
    console.log(event);
    _current_file = event.target.files[0];
  },

  updateCanvas : function(){
    if(this.state.project != null && this.state.project.content.length > 0){
      var fig = this.state.project.content[this.state.page].figure;
      var img = new Image();
      img.src = fig.file.file.url;
      img.onload = function(aImg){
        console.log("Image loaded");
        MainView.draw(img);
      }
      img.onerror = function(err){
        console.log("Image load error : ", err, img);
        throw new Error(err);
      }
    }   
  },
  
  componentWillMount : function() {
    ProjectActionCreator.getProject({ id: this.context.router.getCurrentParams().projectId});
  },

  componentDidMount : function () {
    ProjectStore.addChangeListener(this._onChange);
    MainView.init( React.findDOMNode(this.refs.mainCanvas));
    console.log(this.state.project);
    MainView.showWaitMessage();
  },

  componentWillUpdate : function() {
    return {
    };
  },

  componentDidUpdate : function() {
   this.updateCanvas();
  },

  componentWillUnmount : function() {
    ProjectStore.removeChangeListener(this._onChange);
  },

});

module.exports = Player;
