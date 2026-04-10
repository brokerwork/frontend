import CardPanel from 'components/CardPanel';
import Button from 'components/Button';
import { FIELD_FORM } from '../Forms/Field';
import { CUSTOMIZE_FIELD_FORM } from '../Forms/CustomizeField';
import i18n from 'utils/i18n';
import cs from './UpdateFieldModal.less';
import Nav from 'components/Nav';
import Field from './Field';
import CustomizeField from './CustomizeField';
import { showCustomEditList } from '../../constant';

export default class UpdateFieldModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.selectedField && props.selectedField.userCustom ? 'customize' : 'existing'
    };
  }

  onSave = () => {
    const { submitForm } = this.props;
    const { activeKey } = this.state;
    const fromName = activeKey === 'existing' ? FIELD_FORM : CUSTOMIZE_FIELD_FORM;

    submitForm(fromName);
  };

  onChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  render() {
    const { onClose, type, formId, versionRights } = this.props;
    const { activeKey } = this.state;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>
          {type === 'create' ? i18n['field.setting.field.add.title'] : i18n['field.setting.field.modify.title']}
        </CardPanel.Header>
        <CardPanel.Body>
          {type === 'create' ? (
            <Nav sm activeKey={activeKey} className={cs['nav']} onChange={this.onChange}>
              <Nav.Item eventKey="existing">{i18n['broker.field_setting.choose.existing']}</Nav.Item>
              {showCustomEditList.includes(formId) && versionRights['SC_FIELD_SET'] ? (
                <Nav.Item eventKey="customize">{i18n['broker.field_setting.add.customize']}</Nav.Item>
              ) : (
                undefined
              )}
            </Nav>
          ) : (
            undefined
          )}
          {activeKey === 'existing' ? <Field {...this.props} /> : <CustomizeField {...this.props} />}
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
