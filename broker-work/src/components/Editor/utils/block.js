import { CUSTOM_BLOCK_MAP } from '../contants';
import Image from '../decorators/Image';
import { EditorState } from 'draft-js';

export function blockStyleFn(toHtml, block) {
  const styles = block.getData();
  for (let i in CUSTOM_BLOCK_MAP) {
    const style = styles.get(i);
    if (style) {
      if (toHtml) {
        return {
          style: {
            [i]: style
          }
        };
      } else {
        return `editor-${i.toLowerCase()}-${style}`;
      }
    }
  }
  return '';
}

export function blockRendererFn(toHtml, editorState, block) {
  const type = block.getType();
  if (type === 'atomic') {
    const contentState = editorState.getCurrentContent();
    const entity = contentState.getEntity(block.getEntityAt(0));
    if (entity && entity.type === 'IMAGE') {
      if (toHtml) {
        return <Image contentState={contentState} block={block} />;
      }
      return {
        component: Image,
        editable: false
      };
    }
  }
  return undefined;
}
