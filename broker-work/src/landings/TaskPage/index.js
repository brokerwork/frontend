import { Route, Switch } from 'react-router-dom';
import { CardPanelWrapper } from 'components/CardPanel';

import ObjectDetail from './containers/ObjectDetails';
import ObjectSetting from './containers/ObjectSetting';
import ObjectSettingProcess from './components/ObjectSettingProcess';
import TaskDetails from './containers/TaskDetails';
import TaskTypeListener from './containers/TaskTypeListener';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';
import Root from './containers/Root';

import * as userReducers from '../Usermgmt/controls/reducers';

injectReducer('taskmgmt', reducers);
injectReducer('userManagement', userReducers);

export default class TaskMgmt extends Component {
  render() {
    const props = this.props;
    return (
      <Root {...props}>
        <Route
          path={`${props.match.url}/objects/:objectId`}
          component={TaskTypeListener}
        />
        <Switch>
          <Route
            exact
            path={`${props.match.url}/objects/:objectId/setting`}
            component={ObjectSetting}
          />
          <Route
            path={`${
              props.match.url
            }/objects/:objectId/setting/category/:categoryId`}
            component={ObjectSettingProcess}
          />
          <Route
            path={`${props.match.url}/objects/:objectId`}
            render={objectProps => (
              <ObjectDetail {...objectProps}>
                <Route
                  path={`${props.match.url}/objects/:objectId/task/:taskId`}
                  children={taskProps => (
                    <CardPanelWrapper appear>
                      {taskProps.match && <TaskDetails {...taskProps} />}
                    </CardPanelWrapper>
                  )}
                />
              </ObjectDetail>
            )}
          />
        </Switch>
      </Root>
    );
  }
}
