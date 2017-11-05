import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import { Link } from 'react-router-dom';
import * as colors from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import { CirclePicker } from 'react-color';
import Popover from 'material-ui/Popover';
import { Map } from 'immutable';
import Register from './Register';
import axios from 'axios';
import Modal from 'react-modal';
const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  center: {
    wrapper: <div className="center-align"/>
  },
  right: {
    wrapper: <div className="right-align"/>
  }
}));

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

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      currentFontSize: 12,
      title: '',
      owner: '',
      docid: '',
      inlineStyles: {},
      addUser: '',
      collaborators: []
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

  }

  onChange(editorState) {
    this.setState({
      editorState
    });
  }

  toggleFormat(e, style, block) {
    e.preventDefault();
    if (block) {
      this.setState({
        editorState: RichUtils.toggleBlockType(this.state.editorState, style)
      });
    } else {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
      });
    }
  }

  formatButton({icon, style, block}) {
    return (
    <RaisedButton
    backgroundColor={
      this.state.editorState.getCurrentInlineStyle().has(style) ?
      colors.blue800 :
      colors.blue200 }
      onMouseDown={(e) => this.toggleFormat(e, style, block)}
      icon={<FontIcon
        className="material-icons" color='white'>{icon}</FontIcon>}
    />
  );
  }

  formatColor(color) {
    //create a style for the color
    //use RichUtils to apply the new style
    var newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      {
        [color.hex]: {
          color: color.hex
        }
      });

    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    });
  }

  openColorPicker(e) {
    this.setState({
      colorPickerOpen: true,
      colorPickerButton: e.target
    });
  }

  closeColorPicker() {
    this.setState({
      colorPickerOpen: false
    });
  }

  colorPicker() {
    return (
      <div style={{display: 'inline-block'}}>
        <RaisedButton
        backgroundColor={colors.blue200}
          icon={<FontIcon className="material-icons" color='white'>format_paint</FontIcon>}
          onClick={this.openColorPicker.bind(this)}
        />
        <Popover
          open={this.state.colorPickerOpen}
          anchorEl={this.state.colorPickerButton}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeColorPicker.bind(this)}>
          <CirclePicker onChangeComplete={this.formatColor.bind(this)}/>
        </Popover>
      </div>
    );
  }

  applyIncreaseFontSize(e, shrink) {
    e.preventDefault();
    var newFontSize = this.state.currentFontSize + (shrink ? -4 : 4);
    var newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      {
        [newFontSize]: {
          fontSize: `${newFontSize}px`
        }
      }
    );
    console.log(newInlineStyles, "styles");
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, String(newFontSize)),
      currentFontSize: newFontSize
    });
  }

  increaseFontSize(shrink) {
    return (
    <RaisedButton
    backgroundColor={colors.blue200}
      onMouseDown={(e) => this.applyIncreaseFontSize(e, shrink)}
      icon={<FontIcon
        className="material-icons" color='white'>{shrink ? 'remove_circle' : 'add_box'}</FontIcon>}
    />
  );
  }

  saveDoc() {
    const contentState = this.state.editorState.getCurrentContent();
    const inlineState = this.state.inlineStyles
    console.log('inlinestate', inlineState)
    // console.log('contentState', contentState)
    const rawContentState = convertToRaw(contentState);
    // console.log('rawContentState', rawContentState)
    const stringContent = JSON.stringify(rawContentState);
    // console.log('stringContent', stringContent)

    axios.post(`http://localhost:3000/saveDoc/${this.props.match.params.docid}`, {
      body: stringContent,
      inlineStyles: inlineState
    })
      .then((resp) => {
        console.log(resp.data);
      })
    }

  componentDidMount() {
    axios.get(`http://localhost:3000/getDoc/${this.props.match.params.docid}`)
      .then((resp) => {
        const doc = resp.data;
        if(doc.body) {
            const rawContentState = JSON.parse(doc.body);
            const contentState = convertFromRaw(rawContentState);
            const newEditorState = EditorState.createWithContent(contentState);

            this.setState({
              title: doc.title,
              owner: doc.owner,
              docid: doc._id,
              editorState: newEditorState,
              inlineStyles: doc.inlineStyles,
              collaborators: doc.collaborators
            })
        } else {
            this.setState({
              title: doc.title,
              owner: doc.owner,
              docid: doc._id,
              collaborators: doc.collaborators
          })
        }
      })
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

    handleNameChange(event) {
      this.setState({
        addUser: event.target.value
      })
    }

    addCollaborator() {
      console.log(this.state.addUser, 'adduser');
      axios.post(`http://localhost:3000/addCollab/${this.state.docid}`,
        { username: this.state.addUser })
        .then((resp) => {
          console.log(resp);
          if(resp.data.success === true && resp.data.result.nModified !== 0) {
            this.setState({
              collaborators: [...this.state.collaborators, this.state.addUser],
              addUser: ''
            })
          }
        });
        this.closeModal();
      }

      // removeCollaborator() {
      //   axios.post(`http://localhost:3000/removeCollab/${this.state.docid}`,
      //     { collaborator: this.state.addUser })
      //     .then((resp) => {
      //       console.log(resp);
      //       console.log('first', this.state.collaborators)
      //       var index = this.state.collaborators.indexOf(this.state.addUser);
      //       console.log(index)
      //       var collabs = this.state.collaborators.slice().splice(index, 1)
      //       console.log(collabs)
      //       if(resp.data.success === true) {
      //         this.setState({
      //           collaborators: collabs,
      //           addUser: ''
      //         })
      //       }
      //       console.log('second', this.state.collaborators)
      //     });
      //     this.closeModal();
      //   }

  render() {
    return (
      <div>
        <AppBar title={this.state.title} />
        <h4>Shareable ID: {this.props.match.params.docid}</h4>
        <h4>Owner: {this.state.owner}</h4>
        <h4>Collaborators: {this.state.collaborators.join(', ')}
          <div><button onClick={this.openModal}>Edit Collaborators</button></div></h4>
        <div>
          <Link to='/docs'>Return to Doc Portal</Link><br /><br />
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >

            <button type="button" class="close" data-dismiss="modal" style={{textAlign: "right"}} onClick={this.closeModal}>&times;</button>
            <h2 ref={subtitle => this.subtitle = subtitle}>Edit Collaborators</h2>
            <div>
              Collaborators: <input onChange={(event) => this.handleNameChange(event)} type="text" value={this.state.addUser} /><br />
              <button onClick={() => this.addCollaborator()}>Add</button>
              {/* <button onClick={() => this.removeCollaborator()}>Remove</button> */}
            </div>
          </Modal>
        </div>
        <button onClick={() => this.saveDoc()}>Save</button>
        <div className="toolbar">
          {this.formatButton({icon: 'format_bold', style: 'BOLD' })}
          {this.formatButton({icon: 'format_italic', style: 'ITALIC' })}
          {this.formatButton({icon: 'format_underlined', style: 'UNDERLINE' })}
          {this.colorPicker()}
          {this.formatButton({icon: 'format_list_numbered', style: 'ordered-list-item', block: true })}
          {this.formatButton({icon: 'format_list_bulleted', style: 'unordered-list-item', block: true })}
          {this.formatButton({icon: 'format_align_left', style: 'unstyled', block: true })}
          {this.formatButton({icon: 'format_align_center', style: 'center', block: true })}
          {this.formatButton({icon: 'format_align_right', style: 'right', block: true })}
          {this.increaseFontSize(false)}
          {this.increaseFontSize(true)}
        </div><br />
        <Editor
          ref="editor"
          blockRenderMap={myBlockTypes}
          onChange={this.onChange.bind(this)}
          editorState={this.state.editorState}
          customStyleMap={this.state.inlineStyles}
        />
      </div>
    );
  }
}

export default Main;
