import { stateToHTML } from 'draft-js-export-html';
import { AtomicBlockUtils, ContentState, convertFromRaw } from 'draft-js';
import { CUSTOM_STYLES_MAP } from '../contants';
import { blockStyleFn, blockRendererFn } from './block';

let HTML_INLINE_OPTIONS = {};
for (let i in CUSTOM_STYLES_MAP) {
  const style = CUSTOM_STYLES_MAP[i];
  HTML_INLINE_OPTIONS[i] = { style };
}
export default data => {
  if (typeof data === 'string' || !data.getCurrentContent) return data;
  return stateToHTML(data.getCurrentContent(), {
    inlineStyles: HTML_INLINE_OPTIONS,
    blockStyleFn: blockStyleFn.bind(this, true),
    blockRenderers: blockRendererFn.bind(this, true, data)
  });
};
