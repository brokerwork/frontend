import {
  Route,
  Switch
} from 'react-router-dom';
import Async from 'react-code-splitting';


const OperateReport = props => (
  <Async load={import('./path/OperateReport')} componentProps={props} />
);

const MonthReport = props => (
  <Async load={import('./path/MonthReport')} componentProps={props} />
);


export default () => (
  <Switch>
    <Route path="/home/dealer/operateReport" component={OperateReport} />
    <Route path="/home/dealer/monthReport" component={MonthReport} />
  </Switch>
);
