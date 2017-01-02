import React from'react';
import{ Link }from'react-router';
import Debug from 'debug';

const debug = Debug("fabnavi:jsx:Footer");
export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      footerText: "fabnavi"
    };
  }

  render() {
    return (
      <footer className="belt">
        <hr />
        <p>
          {this.props.footerText}
        </p>
      </footer>
    );
  }
}
