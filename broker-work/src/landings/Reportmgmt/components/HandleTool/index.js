import i18n from 'utils/i18n';
export default class HandleTool extends PureComponent {
  componentDidMount() {
    this.showNotice(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { match: { params: { subPath } } = { params: {} } } = nextProps;
    const { match: { params } = { params: {} } } = this.props;
    if (subPath !== params.subPath) {
      this.showNotice(nextProps);
    }
  }
  componentWillUnmount() {
    const { closeBannerNotice } = this.props;
    closeBannerNotice();
  }
  showNotice = props => {
    const {
      showBannerNotice,
      closeBannerNotice,
      needShowNotice,
      noticeDone,
      match: { params: { subPath } } = { params: {} }
    } = props;
    const showPath = ['commissionreports', 'reports', 'outstandingreport'];
    if (needShowNotice && showPath.includes(subPath)) {
      showBannerNotice({
        content: (
          <div>
            <b>{i18n['banner_notice.notice']}</b>{' '}
            <span>{i18n['report.banner_notice']}</span>
          </div>
        ),
        onClose: () => {
          noticeDone();
        }
      });
    } else {
      closeBannerNotice();
    }
  };
  render() {
    return <div />;
  }
}
