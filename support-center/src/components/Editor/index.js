import {
  Editor,
  EditorState,
  CompositeDecorator,
  Entity
} from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import cs from './editor.less';
import EditorTools from './Tools';
import getHtmlFun from './utils/getHtml';
import { blockStyleFn, blockRendererFn } from './utils/block';
import linkDecorator from './decorators/Link';
import { CUSTOM_STYLES_MAP, BLOCK_DOM_MAP } from './contants';
import rbgToHex from './utils/rgbToHex';
import { insertImage } from './utils/entries';

export const getHtml = getHtmlFun;
export default class EditorContainer extends Component {
  focus = () => {
    this.refs['editor'].focus();
  };
  decorator = new CompositeDecorator([linkDecorator]);
  onToolsToggle = newState => {
    let { onChange } = this.props;
    onChange(newState);
    setTimeout(this.focus, 1);
  };
  handlePastedFiles = files => {
    const { content } = this.props;
    const editorState = content;
    const file = files[0];
    if (!(file && file.type && file.type.includes('image'))) return;
    const reader = new FileReader();
    reader.onload = event => {
      const url = event.target.result; //event.target.results contains the base64 code to create the image.
      insertImage(editorState, url, this.onToolsToggle);
    };
    reader.readAsDataURL(file); //Convert the blob from clipboard to base64
  };
  createFromHtml(html) {
    const state = convertFromHTML({
      htmlToStyle: (nodeName, node, currentStyle) => {
        let newStyle = currentStyle;
        if (nodeName === 'span') {
          if (node.style.color) {
            const colorStyle = rbgToHex(node.style.color);
            if (colorStyle) {
              newStyle = newStyle.add(`FONT_COLOR_${colorStyle}`);
            }
          }
          if (node.style.fontSize) {
            newStyle = newStyle.add(
              `FONT_SIZE_${parseFloat(node.style.fontSize)}`
            );
          }
          if (node.style.fontFamily) {
            newStyle = newStyle.add(`FONT_FAMILY_${node.style.fontFamily}`);
          }
        }
        return newStyle;
      },
      htmlToBlock: (nodeName, node) => {
        if (node.style.textAlign) {
          return {
            type: BLOCK_DOM_MAP[nodeName] || 'unstyled',
            data: {
              textAlign: node.style.textAlign
            }
          };
        }
        if (nodeName === 'figure') {
          return 'atomic';
        }
      },
      htmlToEntity: (nodeName, node) => {
        if (nodeName === 'a') {
          return Entity.create('LINK', 'MUTABLE', {
            url: node.getAttribute('href')
          });
        }
        if (nodeName === 'img') {
          return Entity.create('IMAGE', 'IMMUTABLE', {
            src: node.getAttribute('src')
          });
        }
      }
    })(html);
    return EditorState.createWithContent(state, this.decorator);
  }

  render() {
    let { content = {}, onChange, onBlur } = this.props;
    if (!content.getCurrentInlineStyle) {
      content = this.createFromHtml(content);
    }
    return (
      <div className={cs['container']}>
        <EditorTools
          className={cs['tools']}
          onToggle={this.onToolsToggle}
          editorState={content}
        />
        <div className={`${cs['editor']}`}>
          <Editor
            customStyleMap={CUSTOM_STYLES_MAP}
            editorState={content}
            blockStyleFn={blockStyleFn.bind(this, false)}
            blockRendererFn={blockRendererFn.bind(this, false, content)}
            onChange={onChange}
            onBlur={onBlur}
            handlePastedFiles={this.handlePastedFiles}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}
