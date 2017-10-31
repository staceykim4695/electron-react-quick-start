var React = require('react');
var ReactDOM = require('react-dom');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

require('./css/main.css');
import Main from './Main';

ReactDOM.render(<MuiThemeProvider><Main /></MuiThemeProvider>,
   document.getElementById('root'));
