import React from 'react';
import { HashRouter, Link } from 'react-router-dom';
import axios from 'axios';

class Docs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      name: '',
    };
  }

    handleChange(event) {
      this.setState({
        name: event.target.value
      });
    }

    addDocument() {
      event.preventDefault();
      axios.post('http://localhost:3000/docs',
        { title: this.state.name },
        { withCredentials: true })
      // .then(response => {
      //   return response.json()
      // })
        .then((respJson) => {
          if(respJson.data.success === true) {
            console.log('added document ')
            var newDoc = {
              name: this.state.name
            }
            var docsCopy = this.state.docs.slice();
            docsCopy.push(newDoc)
            this.setState({
              docs: docsCopy,
              name: ''
            })
          } else {
            console.log('error', respJson.data.error)
            this.setState({
                name: ''
            })
          }
        })
        .catch((err) => console.log(err))
      }

  componentDidMount() {
    axios.get('http://localhost:3000/getDocs')
      // .then(resp => resp.json()
      .then(docs => {
        this.setState({ docs: docs.data })
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      // <HashRouter>
        <div>
            <h3>Documents Portal</h3>
            <input onChange={(event) => this.handleChange(event)} type="text" value={this.state.name} />
            <button onClick={() => this.addDocument()}>Create New Document</button>
          <div>
            My Documents
            <ul>
              {this.state.docs.map(doc => (
                <div>
                  <Link to='/editor'>{doc.title}</Link>
                </div>))}
            </ul>
          </div>
            <input type="text" />
            <button>Add Shared Document</button><br />
            <Link to='/Login'>Logout</Link>
        </div>
      // </HashRouter>
    );
  }
}

export default Docs;
