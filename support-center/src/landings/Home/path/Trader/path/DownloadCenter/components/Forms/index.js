import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required, isEmail } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { DOWNLOADER_FORM } from '../../controls/actions';
import Tab from 'components/Tab';

class LinkForm extends PureComponent {
  state = {
    activeKey: 'zh-CN'
  };
  onChangeTab = key => {
    this.setState({
      activeKey: key
    });
  };
  render() {
    const { languages } = this.props;
    return (
      <Form>
        <Tab activeKey={this.state.activeKey} onChange={this.onChangeTab}>
          {languages.map(el => {
            return (
              <Tab.Panel key={el.value} title={el.label} eventKey={el.value}>
                <div style={{ marginTop: 12 }}>
                  <Form.Item>
                    <Form.Label>
                      <span className="required"></span>
                      {i18n['twapp.download_center.label_link_name']}：
                    </Form.Label>
                    <Form.Control>
                      <Field
                        name={'linkNames.' + el.value}
                        label={i18n['twapp.download_center.label_link_name']}
                        fieldType="text"
                        component={FormField}
                      />
                    </Form.Control>
                  </Form.Item>
                  <Form.Item>
                    <Form.Label>
                      <span className="required"></span>
                      {i18n['twapp.download_center.label_link_content']}：
                    </Form.Label>
                    <Form.Control>
                      <Field
                        name={'linkDesces.' + el.value}
                        label={i18n['twapp.download_center.label_link_content']}
                        fieldType="text"
                        component={FormField}
                      />
                    </Form.Control>
                  </Form.Item>
                  <Form.Item>
                    <Form.Label>
                      <span className="required"></span>
                      {i18n['twapp.download_center.label_link_address']}：
                    </Form.Label>
                    <Form.Control>
                      <Field
                        name={'links.' + el.value}
                        label={i18n['twapp.download_center.label_link_address']}
                        fieldType="text"
                        component={FormField}
                      />
                    </Form.Control>
                  </Form.Item>
                </div>
              </Tab.Panel>
            );
          })}
        </Tab>
      </Form>
    );
  }
}

export default reduxForm({ form: DOWNLOADER_FORM })(LinkForm);
