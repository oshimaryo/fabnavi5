import React from 'react';

import NavigationViewActionCreator from '../actions/NavigationViewActionCreator';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = (event) => {
      NavigationViewActionCreator.search('', event.target.value);
    };
  }

  render () {
    return (
      <section className="belt">
        <div className="menu-action search-bar">
          <form>
            <input id="search-box"/>
            <span className="search-icon">

            </span>
          </form>
        </div>
      </section>
      );
  }
}