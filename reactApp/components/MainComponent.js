import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap
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
const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  center: {
    wrapper: <div className="center-align"/>
  },
  right: {
    wrapper: <div className="right-align"/>
  }
}));

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      currentFontSize: 12,
      inlineStyles: {}
    };
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

  render() {
    return (
      <div>
        <AppBar title="Horizon Docs" />
        <Link to='/docs'>Doc Portal</Link>
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
