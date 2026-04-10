import { Tabs, Tab } from 'react-bootstrap';
import setPageTitle from 'utils/setPageTitle';
import { MENUS } from 'utils/headerMenus';
import i18n from 'utils/i18n';
import PagePanel from 'components/PagePanel';
import cs from './Task.less';
import { Layout } from 'components/v2/PageWraper';

export default class Task extends Component {
  state = {
    objectsLoaded: false
  };
  componentDidMount() {
    const {
      getObjects,
      match: { url },
      location: { pathname },
      brandInfo
    } = this.props;

    if (brandInfo.siteName) {
      const moduleName = MENUS.find(item => item.id === 'taskmgmt').label;

      setPageTitle(`${brandInfo.siteName} - ${moduleName}`);
    }

    getObjects().then(() => {
      if (url === pathname) {
        this.jump();
      }
      this.setState({ objectsLoaded: true });
    });
  }
  componentWillReceiveProps(nextProps) {
    const currentPath = this.props.location.pathname;
    const nextPath = nextProps.location.pathname;
    const { match } = this.props;
    if (currentPath !== nextPath && nextPath === match.url) {
      this.jump();
    }
  }
  jump = objectId => {
    const {
      match,
      history: { replace },
      data
    } = this.props;
    if (!(data && data.length)) return;
    const key = objectId || data[0]['itemId'];
    replace(`${match.path}/objects/${key}`);
  };
  render() {
    const { children, data } = this.props;
    const { objectsLoaded } = this.state;
    return (
      <Layout>
        {objectsLoaded &&
          (data && !data.length ? (
            <PagePanel>
              <PagePanel.Header>
                <div className={cs['title']}>
                  {i18n['navigation.task.module_name']}
                </div>
              </PagePanel.Header>
              <PagePanel.Body>
                <div className={cs['no-item']}>
                  <i className="fa fa-folder" />
                  <p>{i18n['task.object_list.no_item']}</p>
                </div>
              </PagePanel.Body>
            </PagePanel>
          ) : (
            children
          ))}
      </Layout>
    );
  }
}
