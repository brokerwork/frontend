import { AtomicBlockUtils } from 'draft-js';

export function insertImage(editorState, url, callback) {
  console.log('url', url);
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    'IMAGE',
    'IMMUTABLE',
    {
      src: url,
      id: 'abc123'
    }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  let newState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );
  if (callback) {
    callback(newState);
  }
}
