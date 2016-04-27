var React = require('react');
var jade = require('react-jade');
var Router = require('react-router');

//他のreactファイル
var Navigation = require('./Navigation.react');
var SearchBar = require('./SearchBar.react');
var ProjectList = require('./ProjectList.react');
var ProjectManager = require('./ProjectManager.react');
var Player = require('./Player.react.js');
var Frame = require('./Frame.react.js');
var Footer = require('./Footer.react.js');
var CreateProject = require('./CreateProject.react.js');
var EditProject = require('./EditProject.react.js');
var ProjectDetail = require('./ProjectDetail.react.js');
var ProjectStore = require('../stores/ProjectStore');


//ract-router
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var NotFoundRoute = Router.NotFoundRoute;
var Redirect = Router.Redirect;

 //フレーム
var routes = React.createElement(Route, { handler: Frame, path: "/" },
    //以下は、メニューバーがついたページの描画
  React.createElement(Route, { handler: ProjectManager, name: "manager" },
    React.createElement(Route, { handler: ProjectList, name: "index" }),
    React.createElement(Route, { handler: CreateProject, name: "create" }),
    React.createElement(Route, { handler: EditProject, name: "edit", path: "edit/:projectId" }),
    React.createElement(Route, { handler: ProjectDetail, name: "project", path:"project/:projectId" }),
    React.createElement(DefaultRoute, { handler: ProjectList }),
    React.createElement(NotFoundRoute, { handler: ProjectList })
  ),
  //以下は、プレイヤーのページの描画
  React.createElement(Route, { handler: Player, name: "player", path:"project/play/:projectId" }),
  React.createElement(Redirect, { from: "/", to:"/manager" }),
  React.createElement(NotFoundRoute, { handler: ProjectManager })
);

//ProjectStoreのinitと, 上で定義されたroutesを基に, Reactをdocument.body以下に展開する
global.onload = function ( ){
  console.log("Fabnavi boot");
  ProjectStore.init();
  Router.run(routes, function(Handler){
    React.render(React.createElement(Handler, null), document.body);
  });
}
