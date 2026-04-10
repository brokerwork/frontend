import { reduxForm, Field } from 'redux-form';
import i18n from 'utils/i18n';
import DropdownForCode from 'components/v2/DropdownForCode';
import { required } from 'utils/renderField';
import cs from './style.less';
import { Form, Input } from 'lean-ui';

export const ADD_SOURCE_FORM = 'RUNMGMT_ADD_SOURCE_FORM';

const ControlWrap = ({ children, error }) => (
  <Form.Control error={error}>{children}</Form.Control>
);

const NickName = ({ data, placeholder, meta: { touched, error }, input }) => (
  <ControlWrap error={touched && error}>
    <input
      type="text"
      {...input}
      className="form-control"
      placeholder={placeholder}
      maxLength={12}
    />
  </ControlWrap>
);

const Mt4Account = ({ data, placeholder, meta: { touched, error }, input }) => (
  <ControlWrap error={touched && error}>
    <input
      type="text"
      {...input}
      className="form-control"
      placeholder={placeholder}
    />
  </ControlWrap>
);

const ServerComp = ({ data, meta: { touched, error }, input }) => (
  <ControlWrap error={touched && error}>
    <DropdownForCode data={data} {...input} />
  </ControlWrap>
);

const MAX_STRATEGY_SIZE = 50;
const StrategyComp = ({
  data,
  placeholder,
  meta: { touched, error },
  input
}) => (
  <Form.Control error={touched && error} className={cs['strategy-control']}>
    <div className={cs['strategy']}>
      <Input.TextArea
        {...input}
        maxLength={MAX_STRATEGY_SIZE}
        className={`form-control ${cs['strategyInput']}`}
        placeholder={i18n['runmgmt.source_setting.table.strategy.placeholder']}
        rows={3}
      />
      <div className={cs['strategySizeBox']}>{`${
        input.value.length
      }/${MAX_STRATEGY_SIZE}`}</div>
    </div>
  </Form.Control>
);

class AddForm extends Component {
  componentDidMount() {
    const { getServerList, serverList } = this.props;
    getServerList();
  }
  serverOptionsGen(serverList) {
    let end = [];
    if (serverList && serverList.MT4.length) {
      end = serverList.MT4.map(s => ({
        label: s.desc,
        value: s.serverId
      }));
    }
    return end;
  }
  render() {
    const { serverList, onSubmit } = this.props;
    const serverOptions = this.serverOptionsGen(serverList);
    return (
      <Form horizontal onSubmit={onSubmit}>
        <Form.Item required col={1}>
          <Form.Label>{i18n['runmgmt.source_setting.table.name']}</Form.Label>
          <Field
            component={NickName}
            name="nickName"
            placeholder={i18n['runmgmt.source_setting.form.name.place_holder']}
          />
        </Form.Item>
        <Form.Item required col={1}>
          <Form.Label>
            {i18n['runmgmt.source_setting.form.serverName']}
          </Form.Label>
          <Field data={serverOptions} component={ServerComp} name="serverId" />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>{i18n['runmgmt.source_setting.table.login']}</Form.Label>
          <Field component={Mt4Account} name="login" />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label>
            {i18n['runmgmt.source_setting.table.strategy']}
          </Form.Label>
          <Field component={StrategyComp} name="investmentStrategy" />
        </Form.Item>
      </Form>
    );
  }
}
function strlen(str) {
  if (str === undefined) {
    return 0;
  }
  const val = str.toString();
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    let c = val.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}
export default reduxForm({
  form: ADD_SOURCE_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  enableReinitialize: true,
  validate: (values = {}) => {
    const errors = {};
    if (values.nickName && strlen(values.nickName) > 12) {
      errors.nickName = i18n['runmgmt.source_setting.form.name.place_holder'];
    }
    if (
      values.nickName &&
      !/[a-zA-Z0-9\u4e00-\u9fa5]/gi.test(values.nickName)
    ) {
      errors.nickName = i18n['runmgmt.source_setting.form.name.place_holder'];
    }
    if (required(values.nickName)) {
      errors.nickName = i18n['runmgmt.source_setting.form.name.required'];
    }
    if (!/^[0-9]+$/g.test(values.login)) {
      errors.login = i18n['runmgmt.source_setting.form.mt4.error'];
    } else if (values.login * 1 > 2147483647) {
      errors.login = i18n['runmgmt.source_setting.form.mt4.error'];
    }
    if (required(values.serverId)) {
      errors.serverId = i18n['runmgmt.source_setting.form.server.error'];
    }
    if (
      !!values.investmentStrategy &&
      values.investmentStrategy.length > MAX_STRATEGY_SIZE
    ) {
      //输入法中文撤销操作下可能会出现超出限制的情况
      errors.investmentStrategy =
        i18n['runmgmt.source_setting.table.strategy.placeholder'];
    }

    return errors;
  }
})(AddForm);
