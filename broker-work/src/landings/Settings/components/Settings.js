import LeftMenu from './LeftMenu';
import setPageTitle from 'utils/setPageTitle';
import i18n from 'utils/i18n';
import cs from './Setting.less';
export default class Settings extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      setPageTitle(`${brandInfo.siteName} - ${i18n['page.title.settings']}`);
    }
  }

  render() {
    return (
      <div className={cs['container']}>
        <LeftMenu {...this.props} />{' '}
        <div className={`${cs['content']} content-container`}>
          <div className={`${cs['content-wrapper']}`}>
            {this.props.children}
          </div>
          {/* <div className={cs.footer}>{i18n['general.copyright']}</div> */}
        </div>
      </div>
    );
  }
}
