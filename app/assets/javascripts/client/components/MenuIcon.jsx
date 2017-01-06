
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
      }
    }
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
      saveCredential(credential)
      dispatch({
        type: 'SIGNED_IN',
        credential
      });
    },
    signingIn: () => {

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
function saveCredential(cred) {
  localStorage.setItem('credentail', JSON.stringify(cred));
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuIcon);
