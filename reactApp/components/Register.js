import React from 'react';
import { Route, HashRouter, Link } from 'react-router-dom'
import Login from './Login'
import axios from 'axios'

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        firstName: '',
        lastName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:3000/register', {
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    }, {
      withCredentials: true
    })
      .then((resp) => {
        if(resp.data.success === true) {
          this.props.history.push('/login');
        } else {
          console.log('error', resp.data.error)
          this.setState({
              username: '',
              password: '',
              firstName: '',
              lastName: ''
          })
        }
      })
      .catch((err) => console.log(err))
    }

  render() {
    return (
      // <HashRouter>
        <div>
          <h3 style={{textAlign: 'center', fontFamily: 'Helvetica Neue'}}>Register</h3>
          <div style={{display: 'flex', justifyContent: 'center', fontFamily: 'Helvetica Neue'}}>
            <div>
              <form action='/register' method='post'>
                  Username: <input name='username' type="text" value={this.state.username} onChange={this.handleChange} /><br />
                  Password: <input name='password' type="password" value={this.state.password} onChange={this.handleChange} /><br />
                  First Name: <input name='firstName' type="text" value={this.state.firstName} onChange={this.handleChange} /><br />
                  Last Name: <input name='lastName' type="text" value={this.state.lastName} onChange={this.handleChange} /><br /><br />
                  <button onClick={this.handleSubmit.bind(this)}>Submit</button>
                    {/* <Route path='/login' component={Login} /> */}
              </form>
              <Link to='/Login'>Login</Link>
            </div>
          </div>
        </div>
      // </HashRouter>
    );
  }
}


export default Register;
