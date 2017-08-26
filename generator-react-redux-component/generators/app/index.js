/* eslint-disable */

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

// Import our modules
const decamelize = require('decamelize');
var mkdirp = require('mkdirp');

module.exports = class extends Generator {

  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('componentName', {
      desc: 'The name of the component we are generating',
      type: String,
      required: true
    });

    // And you can then access it later; e.g.
    this.log(this.options.componentName);

    // Get our component name in all forms
    this.componentName = {};
    this.componentName.camel = this.options.componentName;
    this.componentName.capital =
      this.options.componentName.charAt(0).toUpperCase() +
      this.options.componentName.slice(1);
    this.componentName.dash = decamelize(this.options.componentName, '-');
  }

  writing() {

    // set up our component names object
    var templateReplace = {
      componentName: this.componentName.camel,
      capitalizedComponentName: this.componentName.capital,
      dashComponentName: this.componentName.dash
    }

    // Create our folder
    mkdirp('./' + this.componentName.camel);

    // Copy our component
    this.fs.copyTpl(
      this.templatePath('component.js'),
      this.destinationPath('./' + this.componentName.camel +
        '/' + this.componentName.camel + '.js'),
      templateReplace
    );

    // Copy our container
    this.fs.copyTpl(
      this.templatePath('component.container.js'),
      this.destinationPath('./' + this.componentName.camel +
        '/' + this.componentName.camel + '.container.js'),
      templateReplace
    );

    // Copy our sass
    this.fs.copyTpl(
      this.templatePath('component.scss'),
      this.destinationPath('./' + this.componentName.camel +
        '/' + this.componentName.camel + '.scss'),
      templateReplace
    );
  }
};

/* eslint-enable */
