import React, { Component } from 'react';
import type { Children } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// material-ui
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <MuiThemeProvider>
        <div>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
