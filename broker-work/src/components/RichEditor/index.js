import {
  Entity,
  Editor,
  EditorState,
  convertFromHTML,
  CompositeDecorator,
  ContentState,
  RichUtils
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import { InlineStyleControls } from './inlineStyleControls';
import { EntityControls } from './EntityControls';
import findEntities from './findEntities';
import Link from './Link';
import cs from './richEditor.less';
import i18n from 'utils/i18n';

export default class RichEditor extends Component {
  focus = () => this.refs.editor.focus();
  decorator = new CompositeDecorator([
    {
      strategy: findEntities.bind(null, 'link'),
      component: Link
    }
  ]);
  state = { editorState: EditorState.createEmpty(this.decorator) };
  ENTITY_CONTROLS = [
    { label: 'Add Link', action: this._addLink.bind(this), icon: 'link' },
    {
      label: 'Remove Link',
      action: this._removeLink.bind(this),
      icon: 'unlink'
    }
  ];

  INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD', icon: 'bold' },
    { label: 'Italic', style: 'ITALIC', icon: 'italic' },
    { label: 'Underline', style: 'UNDERLINE', icon: 'underline' },
    { label: 'Monospace', style: 'CODE', icon: 'code' }
  ];

  _addLink(/* e */) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }
    const href = window.prompt(i18n['settings.message_template.input_url']);
    const entityKey = Entity.create('link', 'MUTABLE', { href });
    this.onChange(RichUtils.toggleLink(editorState, selection, entityKey));
  }

  _removeLink(/* e */) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }
    this.onChange(RichUtils.toggleLink(editorState, selection, null));
  }

  toggleInlineStyle = inlineStyle => {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };
  componentDidMount() {
    const { value } = this.props;
    if (value) {
      const blocksFromHTML = convertFromHTML(value);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      this.setState({
        editorState: EditorState.createWithContent(state, this.decorator)
      });
    }
  }
  onChange = editorState => {
    const { onChange } = this.props;
    Promise.resolve(this.setState({ editorState })).then(() => {
      const contentState = this.state.editorState.getCurrentContent();
      if (onChange) {
        let html = '';
        if (contentState.hasText()) {
          html = stateToHTML(contentState);
        }
        onChange(html);
      }
    });
  };
  render() {
    const { editorState } = this.state;
    return (
      <div className={`${cs['RichEditor-root']} form-control`}>
        <div className={cs['RichEditor-controls']}>
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
            inlineStyles={this.INLINE_STYLES}
          />
          <EntityControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
            entityControls={this.ENTITY_CONTROLS}
          />
        </div>
        <div className={cs['RichEditor-editor']}>
          <Editor
            {...this.props}
            editorState={editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
