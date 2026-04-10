import LeftMenu from '../LeftMenu';
import PageWraper from 'components/v2/PageWraper';
import PagePanel from 'components/PagePanel';
import cs from './Root.less';
import setPageTitle from 'utils/setPageTitle';
import i18n from 'utils/i18n';

export default class Root extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      setPageTitle(
        `${brandInfo.siteName} - ${i18n['page.title.message.management']}`
      );
    }
  }

  render() {
    const {
      children,
      pageTitle,
      userRights,
      boxStatus,
      getBoxStatus,
      match
    } = this.props;

    return (
      <PageWraper {...this.props}>
        <div className={cs['container']}>
          <div className={cs['left-menu']}>
            <LeftMenu
              boxStatus={boxStatus}
              userRights={userRights}
              getBoxStatus={getBoxStatus}
              match={match}
            />
          </div>
          <PagePanel className={cs['content']}>
            {/*<PagePanel.Header>{pageTitle}</PagePanel.Header>*/}
            <PagePanel.Body className={cs['body']}>{children}</PagePanel.Body>
          </PagePanel>
        </div>
      </PageWraper>
    );
  }
}
