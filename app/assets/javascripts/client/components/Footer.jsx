import React from'react';
import { Link } from'react-router';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      footerText: "fabnavi"
    };
  }
 

  render() {
      return(
      <footer className="belt">
  <hr />
  <p>
    {this.props.footerText}
  </p>
</footer>
        );
  }


}

module.exports = Footer;
