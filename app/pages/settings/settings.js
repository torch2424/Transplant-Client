import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

export default class Settings extends Component {

  // Declare our props
  props: {}

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="settings">
        <IconButton
          className="pending-transfers__back animated fadeInLeft"
          tooltip="Back"
          containerElement={<Link to="/view" />}>
          <NavigationArrowBack />
        </IconButton>
        <h1>Hello! I am the settings component!</h1>
      </div>
    );
  }
}
