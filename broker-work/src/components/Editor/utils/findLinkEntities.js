export default function findLinkEntities(
  entityType,
  block,
  callback,
  contentState
) {
  block.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === entityType
    );
  }, callback);
}
