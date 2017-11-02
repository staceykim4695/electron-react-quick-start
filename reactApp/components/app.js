var React = require('react');
var ReactDOM = require('react-dom');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Register from './Register';
import Main from './MainComponent';
import Login from './Login'
import Docs from './Docs'
import { Router, HashRouter, Route, Switch} from 'react-router-dom';
import { render } from 'react-dom'

require('../css/main.css');

const Root = () =>
  <HashRouter>
    <Switch>
      <Route path='/' exact component={Register}/>
      <Route path='/login' component={Login} />
      <Route path='/docs' component={Docs} />
      <Route path='/editor' component={Main} />
    </Switch>
      {/* other routes */}
  </HashRouter>

ReactDOM.render(<MuiThemeProvider><Root /></MuiThemeProvider>,
   document.getElementById('root'));
