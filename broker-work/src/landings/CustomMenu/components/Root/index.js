import cs from './index.less';
export default class Root extends Component {
  componentDidMount() {
    const {
      getMenuDetail,
      match: { params }
    } = this.props;
    getMenuDetail(params.id);
  }
  render() {
    const { menuDetail } = this.props;
    let content = '';
    // console.log(menuDetail, 'debug');
    if (menuDetail.source === 'LINK') {
      content = (
        <iframe
          src={menuDetail.value}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      );
    } else if (menuDetail.source === 'CONTENT') {
      content = <div dangerouslySetInnerHTML={{ __html: menuDetail.value }} />;
    }
    return <div className={cs.content_container}>{content}</div>;
  }
}
