import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, convertToRaw, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Raw from 'draft-js-raw-content-state';
import createStyles from 'draft-js-custom-styles';

const customStyleMap = {
 MARK: {
   backgroundColor: 'Yellow',
   fontStyle: 'italic',
 },
};

// Passing the customStyleMap is optional
const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform'], 'CUSTOM_', customStyleMap);

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: new Raw().addBlock('Hello World', 'header-two').toEditorState(),
      readOnly: false,
    };
    this.updateEditorState = editorState => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.updateEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick() {
    this.updateEditorState(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalClick() {
    this.updateEditorState(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onUndClick() {
    this.updateEditorState(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  _onCodeClick() {
    this.updateEditorState(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));
  }

  _onLeftClick() {
    this.updateEditorState(RichUtils.toggleInlineStyle(this.state.editorState, 'LEFT'));
  }

  _onRightClick() {
    this.updateEditorState(RichUtils.toggleInlineStyle(this.state.editorState, 'RIGHT'));
  }

  _onCenterClick() {
    this.updateEditorState(RichUtils.toggleInlineStyle(this.state.editorState, 'CENTER'));
  }

  toggleFontSize(fontSize) {
    const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize);
    return this.updateEditorState(newEditorState);
  }

  toggleColor(color) {
    const newEditorState = styles.color.toggle(this.state.editorState, color);
    return this.updateEditorState(newEditorState);
  }

  render() {
    const { editorState } = this.state;
    const inlineStyles = exporter(this.state.editorState);
    const html = stateToHTML(this.state.editorState.getCurrentContent(), { inlineStyles });
    const options = x => x.map(fontSize => {
      return <option key={fontSize} value={fontSize}>{fontSize}</option>;
    });
    return (
      <div style={{ display: 'flex', padding: '15px' }}>
        <div style={{ flex: '1 0 25%' }}>
          <button onClick={this._onBoldClick.bind(this)}><b>B</b></button>
          <button onClick={this._onItalClick.bind(this)}><i>I</i></button>
          <button onClick={this._onUndClick.bind(this)}><u>U</u></button>
          <button onClick={this._onCodeClick.bind(this)}>Code</button><br />
          <select onChange={e => this.toggleFontSize(e.target.value)}>
            {options(['12px', '24px', '36px', '50px', '72px'])}
          </select>
          <select onChange={e => this.toggleColor(e.target.value)}>
            {options(['green', 'blue', 'red', 'purple', 'orange'])}
          </select><br />
          <button onClick={this._onLeftClick.bind(this)}>Left</button>
          <button onClick={this._onCenterClick.bind(this)}>Center</button>
          <button onClick={this._onRightClick.bind(this)}>Right</button>
        </div>
        <div style={{ flex: '1 0 25%' }}>
          <h2>Draft-JS Editor</h2>
          <Editor
            customStyleFn={customStyleFn}
            customStyleMap={customStyleMap}
            editorState={editorState}
            onChange={this.updateEditorState}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            readOnly={this.state.readOnly}
            spellCheck
          />
        </div>
        {/* <div style={{ flex: '1 0 25%' }}>
          <h2>Exported To HTML</h2>
          <div dangerouslySetInnerHTML={{ __html: html }}/>
        </div> */}
        {/* <div style={{ flex: '1 0 25%' }}>
          <h2>ContentState</h2>
          <div>
            <pre>
              {JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()), null, 2)}
            </pre>
          </div>
        </div> */}
      </div>
    );
  }
}

ReactDOM.render(<RichEditor />,
   document.getElementById('root'));

// var React = require('react');
// var ReactDOM = require('react-dom');
// import {Editor, EditorState, Modifier, RichUtils} from 'draft-js';
//
// /* This can check if your electron app can communicate with your backend */
// // fetch('http://localhost:3000')
// // .then(resp => resp.text())
// // .then(text => console.log(text))
// // .catch(err => {throw err})
//
// class MyEditor extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {editorState: EditorState.createEmpty()};
//     this.focus = () => this.editor.focus();
//     this.onChange = (editorState) => this.setState({editorState});
//     this.handleKeyCommand = this.handleKeyCommand.bind(this);
//     this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
//   }
//
//   handleKeyCommand(command, editorState) {
//     const newState = RichUtils.handleKeyCommand(editorState, command);
//     if (newState) {
//       this.onChange(newState);
//       return 'handled';
//     }
//     return 'not-handled';
//   }
//
//   _onBoldClick() {
//     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
//   }
//
//   _onItalClick() {
//     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
//   }
//
//   _onUndClick() {
//     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
//   }
//
//   _onCodeClick() {
//     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));
//   }
//
//   _toggleColor(toggledColor) {
//     const {editorState} = this.state;
//     const selection = editorState.getSelection();
//     // Let's just allow one color at a time. Turn off all active colors.
//     const nextContentState = Object.keys(colorStyleMap)
//       .reduce((contentState, color) => {
//         return Modifier.removeInlineStyle(contentState, selection, color)
//       }, editorState.getCurrentContent());
//     let nextEditorState = EditorState.push(
//       editorState,
//       nextContentState,
//       'change-inline-style'
//     );
//     const currentStyle = editorState.getCurrentInlineStyle();
//     // Unset style override for current color.
//     if (selection.isCollapsed()) {
//       nextEditorState = currentStyle.reduce((state, color) => {
//         return RichUtils.toggleInlineStyle(state, color);
//       }, nextEditorState);
//     }
//     // If the color is being toggled on, apply it.
//     if (!currentStyle.has(toggledColor)) {
//       nextEditorState = RichUtils.toggleInlineStyle(
//         nextEditorState,
//         toggledColor
//       );
//     }
//     this.onChange(nextEditorState);
//   }
//
//   render() {
//     const {editorState} = this.state;
//     return (
//     <div style={styles.root}>
//       <h3>DOCUMENT TITLE</h3>
//       <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
//         <div className="btn-group mr-2" role="group" aria-label="First group">
//           <button onClick={this._onBoldClick.bind(this)}><b>B</b></button>
//           <button onClick={this._onItalClick.bind(this)}><i>I</i></button>
//           <button onClick={this._onUndClick.bind(this)}><u>U</u></button>
//           <button onClick={this._onCodeClick.bind(this)}>Code</button>
//         </div>
//       </div><br />
//       <ColorControls
//         editorState={editorState}
//         onToggle={this.toggleColor}
//       />
//       <div style={styles.editor} onClick={this.focus}>
//         <StyleButton />
//         <Editor
//           editorState={this.state.editorState}
//           handleKeyCommand={this.handleKeyCommand}
//           customStyleMap={colorStyleMap}
//           editorState={editorState}
//           onChange={this.onChange}
//           ref={(ref) => this.editor = ref}
//         />
//       </div>
//     </div>
//     );
//   }
// }
//
// class StyleButton extends React.Component {
// constructor(props) {
//   super(props);
//   this.onToggle = (e) => {
//     e.preventDefault();
//     this.props.onToggle(this.props.style);
//   };
// }
//
// render() {
//   let style;
//   if (this.props.active) {
//     style = colorStyleMap[this.props.style];
//   } else {
//     style = styles.styleButton;
//   }
//   return (
//     <span style={style} onMouseDown={this.onToggle}>
//       {this.props.label}
//     </span>
//   );
// }
// }
//
// var COLORS = [
// {label: 'Red', style: 'red'},
// {label: 'Orange', style: 'orange'},
// {label: 'Yellow', style: 'yellow'},
// {label: 'Green', style: 'green'},
// {label: 'Blue', style: 'blue'},
// {label: 'Indigo', style: 'indigo'},
// {label: 'Violet', style: 'violet'},
// ];
// const ColorControls = (props) => {
// var currentStyle = props.editorState.getCurrentInlineStyle();
// return (
//   <div style={styles.controls}>
//     {COLORS.map(type =>
//       <StyleButton
//         active={currentStyle.has(type.style)}
//         label={type.label}
//         onToggle={props.onToggle}
//         style={type.style}
//       />
//     )}
//   </div>
// );
// };
// // This object provides the styling information for our custom color
// // styles.
// const colorStyleMap = {
// red: {
//   color: 'rgba(255, 0, 0, 1.0)',
// },
// orange: {
//   color: 'rgba(255, 127, 0, 1.0)',
// },
// yellow: {
//   color: 'rgba(180, 180, 0, 1.0)',
// },
// green: {
//   color: 'rgba(0, 180, 0, 1.0)',
// },
// blue: {
//   color: 'rgba(0, 0, 255, 1.0)',
// },
// indigo: {
//   color: 'rgba(75, 0, 130, 1.0)',
// },
// violet: {
//   color: 'rgba(127, 0, 255, 1.0)',
// },
// };
// const styles = {
// root: {
//   fontFamily: '\'Georgia\', serif',
//   fontSize: 14,
//   padding: 20,
//   width: 600,
// },
// editor: {
//   borderTop: '1px solid #ddd',
//   cursor: 'text',
//   fontSize: 16,
//   marginTop: 20,
//   minHeight: 400,
//   paddingTop: 20,
// },
// controls: {
//   fontFamily: '\'Helvetica\', sans-serif',
//   fontSize: 14,
//   marginBottom: 10,
//   userSelect: 'none',
// },
// styleButton: {
//   color: '#999',
//   cursor: 'pointer',
//   marginRight: 16,
//   padding: '2px 0',
// },
// };
//
// ReactDOM.render(<MyEditor />,
//    document.getElementById('root'));
