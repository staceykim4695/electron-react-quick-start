import React from 'react';
import { HashRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Docs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      docid: '',
      docidpass: '',
      name: '',
      password: '',
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

  }

    handleNameChange(event) {
      this.setState({
        name: event.target.value,
      })
    }

    handlePasswordChange(event) {
      this.setState({
        password: event.target.value
      })
    }

    handleSearchChange(event) {
      this.setState({
        docid: event.target.value,
      })
    }

    handleSearchPassChange(event) {
      this.setState({
        docidpass: event.target.value,
      })
    }

    addDocument() {
      console.log('merp')
      event.preventDefault();
      axios.post('http://localhost:3000/docs',
        { title: this.state.name,
          password: this.state.password },
        { withCredentials: true })
      // .then(response => {
      //   return response.json()
      // })
        .then((respJson) => {
          if(respJson.data.success === true) {
            console.log('added document ')
            // var newDoc = {
            //   name: this.state.name,
            //   password: this.state.password
            // }
            var docsCopy = this.state.docs.slice();
            docsCopy.push(respJson.data.doc)
            this.setState({
              docs: docsCopy,
              name: '',
              password: ''
            })
            this.closeModal();
          } else {
            console.log('error', respJson.data.error)
            this.setState({
                name: '',
                password: ''
            })
          }
        })
        .catch((err) => console.log(err))
      }

  searchDoc() {
    axios.post(`http://localhost:3000/searchDoc/${this.state.docid}`, {
      password: this.state.docidpass
    })
      .then((resp) => {
        var docsCopy = this.state.docs.slice();
        console.log('result', resp.data.result)
        docsCopy.push(resp.data.result)
        if (resp.data.success === true) {
          this.setState({
            docs: docsCopy,
            docid: '',
            docidpass: ''
          })
        } else {
          this.setState({
            docid: '',
            docidpass: ''
          })
        }
      })
    }

  componentDidMount() {
    axios.get('http://localhost:3000/getDocs')
      // .then(resp => resp.json()
      .then(docs => {
        console.log(docs)
        this.setState({ docs: docs.data })
      })
      .catch(err => console.log(err));
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    console.log(this.state.docs, 'docs');
    return (
      // <HashRouter>
        <div>
            <h2>Documents Portal</h2>
              <div>
              <button onClick={this.openModal}>Create a New Document</button>
              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >

                <button type="button" class="close" data-dismiss="modal" style={{textAlign: "right"}} onClick={this.closeModal}>&times;</button>
                <h2 ref={subtitle => this.subtitle = subtitle}>Create a New Document</h2>
                <form>
                  Title: <input onChange={(event) => this.handleNameChange(event)} type="text" value={this.state.name} /><br />
                  Password: <input onChange={(event) => this.handlePasswordChange(event)} type="password" value={this.state.password} /><br /><br />
                  <button onClick={() => this.addDocument()}>Create</button>
                </form>
              </Modal>
            </div>
          <div><br />
            <h4>My Documents</h4>
            <ul>
              {this.state.docs.map(doc => (
                <div key={doc._id}>
                  <Link to={`/edit/${doc._id}`}>{doc.title}</Link>
                </div>))}
            </ul>
          </div>
          <div>
            <h4>Add a Document By Its ID</h4>
            Document ID: <input type="text" onChange={(event) => this.handleSearchChange(event)} value={this.state.docid}/><br />
            Document Password: <input type="password" onChange={(event) => this.handleSearchPassChange(event)} value={this.state.docidpass}/><br />
            <button onClick={() => this.searchDoc()}>Add By Document ID</button><br /><br />
          </div>
            <Link to='/Login'>Logout</Link>
        </div>
      // </HashRouter>
    );
  }
}

export default Docs;
