import TopAlert from 'components/TopAlert';
import Loading from 'components/Loading';
import cs from './Root.less';
import setPageTitle from 'utils/setPageTitle';
import { OpacityWrapper } from 'components/OpacityWrapper';

export default class Root extends Component {
  brandInfoReady = false;
  componentDidMount() {
    const { getBrandInfo } = this.props;
    getBrandInfo().then(res => {
      const {
        data: { productIcon, siteName },
        result
      } = res;
      // 设置网站的favicon
      if (!(result && productIcon)) return Promise.resolve(res);
      const iconEle = document.createElement('link');
      const iconEleIe = document.createElement('link');
      const head = document.getElementsByTagName('head')[0];
      iconEle.setAttribute('rel', 'shortcut icon');
      iconEle.setAttribute('type', 'image/x-icon');
      iconEle.setAttribute('href', productIcon);
      iconEleIe.setAttribute('rel', 'icon');
      iconEleIe.setAttribute('type', 'image/x-icon');
      iconEleIe.setAttribute('href', productIcon);
      head.appendChild(iconEleIe);
      head.appendChild(iconEle);

      this.brandInfoReady = true;
      setPageTitle(siteName);
    });
  }
  render = () => {
    const {
      children,
      className = '',
      warning,
      topAlertData,
      closeTopAlert,
      loading,
      transparentMask,
      align,
      brandInfo
    } = this.props;
    let bgStyle = {};
    let defaultBgCls = '';
    if (this.brandInfoReady) {
      if (brandInfo.background) {
        bgStyle['backgroundImage'] = `url(${brandInfo.background})`;
      }
      switch (align) {
        case 'left':
          defaultBgCls = cs['bg_left'];
          break;
        case 'right':
          defaultBgCls = cs['bg_right'];
          break;
        default:
          defaultBgCls = cs['bg_center'];
          break;
      }
    }
    let alignCls = 'container';
    if (align === 'left') {
      alignCls = 'containerLeft';
    } else if (align === 'right') {
      alignCls = 'containerRight';
    }
    const cls = `${cs[alignCls]} ${className}`;
    return (
      <div className={cls}>
        {topAlertData ? (
          <TopAlert onClose={closeTopAlert} {...topAlertData} />
        ) : (
          undefined
        )}

        <OpacityWrapper appear>
          {loading ? <Loading /> : undefined}
        </OpacityWrapper>

        {transparentMask ? (
          <div className={cs['transparent-mask']} />
        ) : (
          undefined
        )}

        <div className={cs['inner-box']}>
          {warning}
          <div className={cs['inner-box-bg']}>{children}</div>
        </div>
        <div
          data-test="bg"
          className={`${cs['bg']} ${defaultBgCls}`}
          style={bgStyle}
        />
      </div>
    );
  };
}
