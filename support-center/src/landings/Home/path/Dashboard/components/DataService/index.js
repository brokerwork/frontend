import Panel from 'components/Panel';
import i18n from 'utils/i18n';
import FormField from 'components/FormField';
import Form from 'components/Form';
import { reduxForm, Field } from 'redux-form';
import cs from './style.less';

export default class DataService extends PureComponent {
  state = {
    code: '',
    error: false
  };
  onCodeChange(val) {
    this.setState({
      code: val.code || ''
    });
  }
  showMessage() {
    const { showTipsModal, getVeriCode, delData } = this.props;
    const { error } = this.state;
    showTipsModal({
      content: (
        <div>
          <h3>{i18n['dashboard.data_service.warn1']}</h3>
          <p>{i18n['dashboard.data_service.warn2']}</p>
          <h3>{i18n['dashboard.data_service.warn3']}</h3>
          <p>{i18n['dashboard.data_service.warn4']}</p>
          <p>{i18n['dashboard.data_service.warn5']}</p>
        </div>
      ),
      onConfirm: cb => {
        getVeriCode().then(({ result }) => {
          if (result) {
            cb();
            showTipsModal({
              confirmBtnText: i18n['general.approve'],
              content: (
                <Verify
                  onChange={this.onCodeChange.bind(this)}
                  error={error}
                />
              ),
              onConfirm: cbx => {
                const { code } = this.state;
                delData(code).then(res => {
                  if (res.result) {
                    cbx();
                  } else {
                    this.setState({
                      error: true
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  render() {
    return (
      <Panel header={i18n['dashboard.data_service']}>
        <a onClick={this.showMessage.bind(this)}>
          {i18n['dashboard.data_service.title']}
        </a>
      </Panel>
    );
  }
}
class DForm extends Component {
  render() {
    const { error, onChange } = this.props;
    return (
      <Form>
        <Form.Item>
          <Form.Control>
            <Field
              name="code"
              fieldType="text"
              component={FormField}
              onChange={onChange}
              error={error ? <red>{i18n['general.error']}</red> : undefined}
            />
          </Form.Control>
        </Form.Item>
        <p className={cs['red']}>{i18n['dashboard.data_service.warn7']}</p>
      </Form>
    );
  }
}

const EndForm = reduxForm({
  form: 'DATA_SERVICE_FORM'
})(DForm);


class Verify extends Component {
  onChange(val) {
    const { onChange } = this.props;
    onChange(val);
  }
  render() {
    const { error } = this.props;
    return (
      <div>
        <p>{i18n['dashboard.data_service.warn6']}</p>
        <EndForm onChange={this.onChange.bind(this)} error={error} />
      </div>
    );
  }
}
