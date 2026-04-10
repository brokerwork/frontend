import {
  Route,
  Switch
} from 'react-router-dom';
import Async from 'react-code-splitting';
import Login from './path/Login';
import ForgotPassword from './path/ForgotPassword';


const ModifyPassword = props => (
  <Async load={import('./path/ModifyPassword')} componentProps={props} />
);


export default () => (
  <Switch>
    <Route path="/forgotPassword" component={ForgotPassword} />
    <Route path="/modifyPassword" component={ModifyPassword} /> 
    <Route path="/" component={Login} /> 
  </Switch>
);
