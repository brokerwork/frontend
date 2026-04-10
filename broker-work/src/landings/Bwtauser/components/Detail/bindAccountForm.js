import { Form } from 'lean-ui';
import { Field } from 'redux-form';
import LoginSearch from './LoginSearch';
import { reduxForm } from 'redux-form';
import i18n from 'utils/i18n';
import DropdownForCode from 'components/v2/DropdownForCode';
import { get } from 'utils/ajax';
import { isRequired } from 'utils/validate';
import { FormattedMessage } from 'react-intl';
export const BIND_ACCOUNT_FORM = 'BIND_ACCOUNT_FORM';
class BindAccountForm extends Component {
  state = {
    serverId: '',
    vendor: '',
    login: ''
  };
  onServerChange = (selected, item) => {
    const { onServerChange } = this.props;
    const { serverId, vendor } = item;
    this.setState(
      {
        serverId,
        vendor,
        login: ''
      },
      () => {
        if (onServerChange) {
          onServerChange({
            serverId,
            vendor
          });
        }
      }
    );
  };
  serverSelectGenerator = ({ meta: { touched, error }, input, disabled }) => {
    const { serverId } = this.state;
    const { demoServerList } = this.props;
    const isError = touched && error;
    return (
      <Form.Control errorMsg={isError ? error : null}>
        <DropdownForCode
          value={serverId}
          data={demoServerList}
          disabled={disabled}
          onChange={(d, item) => {
            this.onServerChange(d, item);
            input.onChange(item);
          }}
          placeholder={i18n['general.default_select']}
        />
      </Form.Control>
    );
  };
  clearLogin = () => {
    this.setState({
      login: ''
    });
  };
  onLoginSelect = selected => {
    this.setState({
      login: selected && selected.value
    });
  };
  searchInputAjax = v => {
    const { editUserInfo } = this.props;
    const { vendor, serverId } = this.state;
    if (!v) {
      return Promise.resolve({
        result: true,
        data: []
      });
    }
    if (!(vendor && serverId)) {
      Message.error(i18n['user_setting.basic_info.default_server_select']);
      return Promise.resolve({
        result: true,
        data: []
      });
    }
    let copyData = v;
    if (!v) {
      copyData = 0;
    }
    return get({
      url: `/v1/account/manage/fuzzy/${copyData}?returnNum=10`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    });
  };
  loginSelectGenerator = ({ meta: { touched, error }, input, disabled }) => {
    const { isTask, type, userRights } = this.props;
    const { login, serverId } = this.state;
    let loginPlaceholer = '';
    const isError = touched && error;
    return (
      <Form.Control errorMsg={isError ? error : null}>
        <LoginSearch
          error={touched && error}
          disabled={disabled}
          defaultValue={login}
          deleteIcon={true}
          clearValue={this.clearLogin}
          onChange={(d, item) => {
            this.onLoginSelect(item);
            input.onChange(item);
          }}
          getLogin={this.searchInputAjax}
        />
      </Form.Control>
    );
  };
  render() {
    const { demoServerList } = this.props;
    const { serverId, vendor, login } = this.state;
    return (
      <Form>
        <Form.Item key="server" col={2}>
          <Form.Label required>
            {i18n['usermgmt.form_field.server']}:
          </Form.Label>
          <Field
            component={this.serverSelectGenerator}
            serverList={demoServerList}
            name="serverId"
          />
        </Form.Item>
        <Form.Item key="login" col={2}>
          <Form.Label required>
            {i18n['tausermgmt.detail.account.bind_sim_account.choose']}:
          </Form.Label>
          <Field
            component={this.loginSelectGenerator}
            login={login}
            serverId={serverId}
            name="login"
          />
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: BIND_ACCOUNT_FORM,
  validate: function(values) {
    console.log('validate', values);
    let errors = {};
    // 服务器组必填验证
    if (!isRequired(values.serverId)) {
      errors['serverId'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n['usermgmt.form_field.server'] }}
        />
      );
    }
    if (!isRequired(values.login)) {
      errors['login'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{
            value: i18n['tausermgmt.detail.account.bind_sim_account.choose']
          }}
        />
      );
    }
    return errors;
  }
})(BindAccountForm);
