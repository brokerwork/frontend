export default class Image extends Component {
  render() {
    const { block, contentState } = this.props;
    let { src } = contentState.getEntity(block.getEntityAt(0)).getData();
    return <img src={src} />;
  }
}
