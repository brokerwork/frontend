import { findDOMNode } from 'react-dom';
import { InputGroup, FormControl, Button, FormGroup } from 'react-bootstrap';
import { Entity, RichUtils, EditorState } from 'draft-js';
import PopUpTool from './PopUpTool';
import cs from '../Editor.less';
import i18n from 'utils/i18n';

class LinkPop extends Component {
  state = {
    url: '',
    initUrl: undefined
  };

  onChange = e => {
    const url = e.target.value;
    this.setState({
      url
    });
  };

  onSubmit = () => {
    const { onSubmit, editorState } = this.props;
    if (onSubmit) {
      const { url } = this.state;
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        { url }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity
      });
      onSubmit(RichUtils.toggleLink(newEditorState, selection, entityKey));
    }
  };

  onUnlink = () => {
    const { editorState, onSubmit } = this.props;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      onSubmit(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  onCancel = () => {
    const { editorState, onSubmit } = this.props;
    onSubmit(editorState);
  };

  componentDidMount() {
    const { editorState } = this.props;
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    if (linkKey) {
      const linkInstance = contentState.getEntity(linkKey);
      const { url } = linkInstance.getData();
      this.setState({
        url,
        initUrl: url
      });
    }
    const input = findDOMNode(this.url);
    setTimeout(() => input.focus(), 0);
  }

  render() {
    const { url, initUrl } = this.state;
    return (
      <div className={cs['pop-box']}>
        <form onSubmit={this.onSubmit}>
          <FormGroup>
            <FormControl
              ref={c => {
                this.url = c;
              }}
              value={url}
              onChange={this.onChange}
              type="text"
            />
          </FormGroup>
          <div className={cs['link-pop-btns']}>
            <Button bsStyle="primary" type="submit">
              {i18n['general.save']}
            </Button>{' '}
            {initUrl ? (
              <Button bsStyle="danger" onClick={this.onUnlink}>
                {i18n['general.delete']}
              </Button>
            ) : (
              undefined
            )}{' '}
            <Button onClick={this.onCancel}>{i18n['general.close']}</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default class ToolLink extends PopUpTool {
  onSubmit = newState => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(newState);
    }
    this.togglePop(false);
  };

  render() {
    const { editorState, active } = this.props;
    const { show } = this.state;
    return (
      <div className={`${cs['tools-item']} ${active ? cs['active'] : ''}`}>
        <div className="pop-label">
          <i
            className={'fa fa-link'}
            onClick={this.togglePop.bind(this, undefined)}
          />
        </div>
        {show ? (
          <LinkPop editorState={editorState} onSubmit={this.onSubmit} />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
