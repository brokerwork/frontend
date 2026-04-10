import { Switch, Route, Redirect } from 'react-router-dom';
import PageWraper from 'components/PageWraper';
import SourceSetting from './path/Follow/SourceSetting';
import Live from './path/Video/Live';
import Article from './path/Content/Article';
import NewArticle from './path/Content/NewArticle';
import Column from './path/Content/Column';
import VideoMgmt from './path/Video/VideoMgmt';
import Menu from './components/Menu';
import Banners from './path/Content/Banners';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';
import { connect } from 'react-redux';
import cs from './index.less';

injectReducer('runmgmt', reducers);
class Runmgmt extends Component {
  render() {
    const props = this.props;
    const { userRights } = this.props;
    let redirectUrl = '';
    if (userRights['LIVE_LIVE']) {
      redirectUrl = '/live';
    } else if (userRights['LIVE_DEMAND']) {
      redirectUrl = '/videomgmt';
    } else if (userRights['OPERATION_COPY']) {
      redirectUrl = '/follow/source_setting';
    } else if (userRights['LIVE_CONTENT']) {
      redirectUrl = '/runmgmt/content/article';
    }
    const footClass = {
      classNames: true
    };
    return (
      <PageWraper {...props} className={cs['runmgmt']} footer={footClass}>
        <div className={cs['container']}>
          <Menu {...props} />
          <div className={cs['content']}>
            <Switch>
              <Route
                path={`${props.match.path}/follow/source_setting`}
                component={SourceSetting}
              />
              <Route
                path={`${props.match.url}/live/:liveId`}
                component={Live}
              />
              <Route path={`${props.match.path}/live`} component={Live} />
              <Route
                path={`${props.match.url}/videomgmt/:videoId`}
                component={VideoMgmt}
              />
              <Route
                path={`${props.match.path}/videomgmt`}
                component={VideoMgmt}
              />
              <Route
                path={`${props.match.path}/content/article/new`}
                component={NewArticle}
              />
              <Route
                path={`${props.match.path}/content/article/:id`}
                component={NewArticle}
              />
              <Route
                path={`${props.match.path}/content/article`}
                component={Article}
              />
              <Route
                path={`${props.match.path}/content/column`}
                component={Column}
              />
              <Route
                path={`${props.match.path}/content/banners`}
                component={Banners}
              />
              <Redirect
                from={props.match.url}
                to={`${props.match.path}${redirectUrl}`}
              />
            </Switch>
          </div>
        </div>
      </PageWraper>
    );
  }
}

export default connect(
  ({ common: { brandInfo, userRights } }) => ({
    brandInfo,
    userRights
  }),
  {}
)(Runmgmt);
