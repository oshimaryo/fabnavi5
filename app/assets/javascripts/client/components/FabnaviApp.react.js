const
    React = require('react'),
    jade = require('react-jade'),

    //他のreactファイル
    Navigation = require('./Navigation.react'),
    SearchBar = require('./SearchBar.react'),
    ProjectList = require('./ProjectList.react'),
    ProjectManager = require('./ProjectManager.react'),
    Player = require('./Player.react.js'),
    Frame = require('./Frame.react.js'),
    Footer = require('./Footer.react.js'),
    CreateProject = require('./CreateProject.react.js'),
    EditProject = require('./EditProject.react.js'),
    ProjectDetail = require('./ProjectDetail.react.js'),
    ProjectStore = require('../stores/ProjectStore'),
    WebAPIUtils = require('../utils/WebAPIUtils'),
    ServerActionCreator = require('../actions/ServerActionCreator'),


    //ract-router
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler,
    NotFoundRoute = Router.NotFoundRoute,
    Redirect = Router.Redirect;

 //フレーム
const routes = React.createElement(Route, { handler: Frame, path: "/" },
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
  if(WebAPIUtils.isSigningIn()){
    ServerActionCreator.signIn();
  }
  if(WebAPIUtils.SignOut()){
    ServerActionCreator.signOut();
  }
}
