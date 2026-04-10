import { AtomicBlockUtils } from 'draft-js';

export function insertImage(editorState, url, callback) {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    'IMAGE',
    'IMMUTABLE',
    {
      src: url
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
