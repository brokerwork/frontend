import { Entity, RichUtils, EditorState, Modifier } from 'draft-js';
import { CUSTOM_BLOCK_MAP } from '../contants';
export default class DefaultTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }
  getAtiveValue = (editorState, data) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const blockType = block.getType();
    const blockData = block.getData();
    const active =
      data.find(item => {
        if (item.type === 'INLINE') {
          return currentStyle.has(item.value);
        } else if (item.key) {
          return blockData.get(item.key) === item.value;
        } else if (item.type === 'BLOCK') {
          return blockType === item.value;
        } else {
          return false;
        }
      }) || false;
    return active;
  };

  reduceStyle = (styleMap, toggledStyle, callback) => {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    const nextContentState = styleMap.reduce((contentState, style) => {
      if (style === toggledStyle) return contentState;
      return Modifier.removeInlineStyle(contentState, selection, style);
    }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );
    if (callback) {
      callback(nextEditorState);
    }
  };

  change = (tool, nextEditorState) => {
    let { editorState, onChange } = this.props;
    if (nextEditorState && nextEditorState.getSelection) {
      editorState = nextEditorState;
    }
    let newState;
    switch (tool.type) {
      case 'INLINE':
        newState = RichUtils.toggleInlineStyle(editorState, tool.value);
        break;
      case 'BLOCK':
        let _value = null;
        if (CUSTOM_BLOCK_MAP[tool.key]) {
          if (!this.getAtiveValue(editorState, [tool])) {
            _value = tool.value;
          }
          const newContentState = Modifier.setBlockData(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            { [tool.key]: _value }
          );
          newState = EditorState.push(
            editorState,
            newContentState,
            'change-block-data'
          );
        } else {
          newState = RichUtils.toggleBlockType(editorState, tool.value);
        }
        break;
      case undefined:
        newState = RichUtils.toggleInlineStyle(editorState, tool);
        break;
      default:
        newState = editorState;
    }
    if (onChange) {
      onChange(newState);
    }
  };
}
