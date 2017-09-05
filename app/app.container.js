import React, { Component } from 'react';
import type { Children } from 'react';

// Material UI imports
import {
  green400,
  green600,
  blueGrey300,
  pink300,
  pink500,
  blueGrey500
} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

// material-ui
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green400,
    primary2Color: green600,
    primary3Color: blueGrey300,
    accent1Color: pink300,
    accent2Color: pink500,
    accent3Color: blueGrey500,
    pickerHeaderColor: green400,
  }
});

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
