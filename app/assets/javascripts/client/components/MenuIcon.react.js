//親はNavigation.react
//メニューアイコンのクリックの反応について書いてる
//actionはProjectSelectorStoreに送ってる
import NavigationViewActionCreator from'../actions/NavigationViewActionCreator';
import React from'react';

console.log(React);
import menuIcon from'../templates/MenuIcon.jade';

class MenuIcon extends React.Component{
//Navigation.jadeにあるactとsrc
/*
  propTypes : {
    act   : React.PropTypes.string.isRequired,
    src   : React.PropTypes.string.isRequired,
  },
*/
  constructor(props){
    super(props);
    this.state = {};
    this.props = {};
    this.onclick = this.onclick.bind(this);
  }

  render(){
    return menuIcon(Object.assign(
      this,
      this.props,
      this.state));
  }

  onclick(){
    NavigationViewActionCreator.menuSelect(this.props.act);
  }

  componentWillMount(){
    return {
    };
  }

  componentDidMount(){

  }

  componentWillUpdate(){
    return {
    };
  }

  componentDidUpdate(){
    return {
    };
  }

  componentWillUnmount(){
    return {
    };
  }

}

export default MenuIcon;
