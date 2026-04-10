import {
  AtomicBlockUtils,
  // Editor,
  EditorState,
  RichUtils,
  ContentState,
  DefaultDraftBlockRenderMap,
  Entity
} from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
// focus plugin
import createFocusPlugin from 'draft-js-focus-plugin';

import createPrismPlugin from 'draft-js-prism-plugin';
import 'draft-js-focus-plugin/lib/plugin.css';

import createImagePlugin from 'draft-js-image-plugin';
import createLinkPlugin from 'draft-js-link-plugin';

import { convertFromHTML } from 'draft-convert';
import EditorTools from './Tools';
import getHtmlFun from './utils/getHtml';
import { blockStyleFn, blockRendererFn } from './utils/block';
import linkDecorator from './decorators/Link';
import { CUSTOM_STYLES_MAP, BLOCK_DOM_MAP } from './contants';
import rbgToHex from './utils/rgbToHex';
import { insertImage } from './utils/entries';

import cs from './Editor.less';
const linkPlugin = createLinkPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  resizeablePlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const plugins = [linkPlugin, focusPlugin, resizeablePlugin, imagePlugin];

export const getHtml = getHtmlFun;
export default class EditorContainer extends Component {
  focus = () => {
    this.refs['editor'].focus();
  };
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
    return EditorState.createWithContent(state);
  }

  render() {
    let { content, onChange, onBlur } = this.props;
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
            plugins={plugins}
            handlePastedFiles={this.handlePastedFiles}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}
