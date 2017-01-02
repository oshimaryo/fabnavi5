//親はNavigation.react
//メニューアイコンのクリックの反応について書いてる
//actionはProjectSelectorStoreに送ってる
import NavigationViewActionCreator from'../actions/NavigationViewActionCreator';
import React from'react';

console.log(React);

class MenuIcon extends React.Component{

  constructor(props){
    super(props);
    this.onclick = this.onclick.bind(this);
  }

  render(){
    return (
    <a className="menu-action nav-action" 
      onClick={this.onclick} >
      <img src={this.props.src} />
    </a>

      )
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
