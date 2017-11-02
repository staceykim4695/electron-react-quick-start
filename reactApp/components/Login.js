import React from 'react';
import { HashRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Docs from './Docs'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
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
    axios.post('http://localhost:3000/login', {
      username: this.state.username,
      password: this.state.password,
    }, {
      withCredentials: true
    })
    // .then(response => {
    //   return response.json()
    // })
      .then((resp) => {
        console.log('handlesubmit resp', resp)
        if(resp.data.success === true) {
          this.props.history.push('/docs');

        } else {
          console.log('no user')
          alert('Cannot find user')
          }
        })
      }

  render() {
    return (
      // <HashRouter>
        <div>
          <h3 style={{textAlign: 'center', fontFamily: 'Helvetica Neue'}}>Login</h3>
          <div style={{display: 'flex', justifyContent: 'center', fontFamily: 'Helvetica Neue'}}>
            <div>
              <form action='/login' method='post'>
                  Username: <input name='username' type="text" value={this.state.username} onChange={this.handleChange} /><br />
                  Password: <input name='password' type="password" value={this.state.password} onChange={this.handleChange} /><br />
                  <button onClick={this.handleSubmit.bind(this)}>Submit</button><br />
              </form><br />
              <Link to='/Register'>Register</Link>
            </div>
          </div>
        </div>
      // </HashRouter>s
    );
  }
}

export default Login;
