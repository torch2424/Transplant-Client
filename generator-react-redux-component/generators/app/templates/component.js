import React, { Component } from 'react';

export default class <%= capitalizedComponentName %> extends Component {

  // Declare our props
  props: {
    isComponent: boolean,
  }

  // Our constructor, where we shall be setting state
  constructor(props) {
    super(props);

    if (this.props.isComponent) {
      console.log('This is a component!');
    }
  }

  render() {
    return (
      <div className="<%= dashComponentName %>">
        <h1>Hello! I am the <%= componentName %> component!</h1>
      </div>
    );
  }
}
