
import React from 'react';
import { connect } from 'react-redux';
import Debug from 'debug';
import { browserHistory } from 'react-router';

const debug = Debug('fabnavi:jsx:MenuIcon');

class MenuIcon extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = () => {
      if(this.props.hasOwnProperty('to')) {
        browserHistory.push(this.props.to);
      }
      if(this.props.hasOwnProperty('act')) {
        if(this.props.act === 'sign_in') {
          this.signIn();
        } else {
          this.signOut();
        }
      }
    };

    this.signIn = () => {
      const host = window.location.origin;
      const url = `${host}/auth/github?auth_origin_url=${host}`;
      window.open(url);
      window.addEventListener('message', (e) => {
        if(e.origin === window.location.origin) {
          try{
            this.props.signedIn(JSON.parse(e.data));
          } catch(error) {
            this.props.signInFailed(error, e);
          }
        }
      });
    };

    this.signOut = () => {

    };
  }

  render() {
    return (
      <a className="menu-action nav-action"
        onClick={this.onClick} >
        <img src={this.props.src} />
      </a>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    signedIn: (credential) => {
      api.saveCredential(credential)
      dispatch({
        type: 'SIGNED_IN',
        credential
      });
    },
    signingIn: () => {
      // TODO: (implement) signingIn
    },
    signingOut: () => {
      // TODO: (implement) signingOut
    },
    signedOut: () => {
      // TODO: (implement) signedOut, then remove credential
    },
    signInFailed: (error, info) => {
      const now = new Date();
      dispatch({
        type: 'SIGN_IN_FAILED',
        message: 'sign in failed. see console',
        error,
        info,
        time: now.toTimeString()
      });
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MenuIcon);
