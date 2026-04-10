import Loading from 'components/Loading';
import TopAlert from 'components/TopAlert';
import TipsModal from 'components/TipsModal';

export default class PageWrapper extends PureComponent {
  state = {
    ready: false
  }

  componentDidMount() {
    const { getI18nData } = this.props;
    const headEl = document.getElementsByTagName('head')[0];
    const scriptTag = document.createElement('script');

    scriptTag.src = `${__ASSETS_PATH__}/ckeditor/ckeditor.js`;

    headEl.appendChild(scriptTag);

    getI18nData().then(({ result }) => {
      if (result) {
        this.setState({
          ready: true
        });
      }
    });
  }

  render() {
    const { ready } = this.state;
    const { 
      children, loading, transparentMask,
      tipsModalData, closeTipsModal,
      topAlertData, closeTopAlert
    } = this.props;

    if (!ready) {
      return null;
    }

    return (
      <div>
        {children}    

        {tipsModalData
        ? <TipsModal
            onHide={closeTipsModal}
            {...tipsModalData}
          />
        : undefined}

        {topAlertData
        ? <TopAlert
            onClose={closeTopAlert}
            {...topAlertData}
          />
        : undefined}

        {loading
        ? <Loading />
        : undefined}
        
        {transparentMask
        ? <div className="transparent-mask" />
        : undefined}
        
      </div>
    );
  }
}