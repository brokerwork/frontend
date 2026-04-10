export default class ObjectList extends Component {
  componentDidMount() {
    const { getObjects, location: { pathname }, match: { path } } = this.props;
    if (pathname !== path) return;
    getObjects().then(() => {
      this.jump(this.props);
    });
  }
  componentWillReceiveProps(nextProps) {
    const currentPath = this.props.location.pathname;
    const nextPath = nextProps.location.pathname;
    const { match } = this.props;
    if (currentPath !== nextPath && nextPath === match.url) {
      this.jump(nextProps);
    }
  }
  jump = props => {
    const { match, history: { replace }, data } = props;
    replace(`${match.url}/objects/${data[0]['itemId']}`);
  };
  render() {
    return null;
  }
}
