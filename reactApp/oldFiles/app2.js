var React = require('react');
var ReactDOM = require('react-dom');
// import {Editor, EditorState, RichUtils} from 'draft-js';
// import { ColorEditor, StyleButton } from './colorEditor';

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err})

require('./css/main.css'); 

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onUndClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  _onCodeClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));
  }

  render() {
    return (
      <div>
        <h3>DOCUMENT TITLE</h3>
        <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
          <div className="btn-group mr-2" role="group" aria-label="First group">
            <button onClick={this._onBoldClick.bind(this)}><b>B</b></button>
            <button onClick={this._onItalClick.bind(this)}><i>I</i></button>
            <button onClick={this._onUndClick.bind(this)}><u>U</u></button>
            <button onClick={this._onCodeClick.bind(this)}>Code</button>
          </div>
        </div>
        <ColorEditor />
        <StyleButton />
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

// ReactDOM.render(<MyEditor />,
//    document.getElementById('root'));
