import Form from 'components/Form';
import cs from './index.less';
import i18n from 'utils/i18n';
import Checkbox from 'components/Checkbox';

// ALLOWED_APPLY_ACCOUNT 允许申请该账户类型
export const layoutRightsLists = ['ALLOWED_APPLY_ACCOUNT'];

export default class CForm extends PureComponent {
  handleChangeRights = field => val => {
    const value = val.target.checked;
    this.props.handleChangeRights(field, value, this.props.index);
  };
  render() {
    const { initialValues, index, isDisabled } = this.props;
    return (
      <Form showHelpText className={cs.account_setting}>
        {layoutRightsLists.map((field, index) => {
          return (
            <Form.Item key={index}>
              <Form.Control>
                <Checkbox
                  checked={initialValues[field]}
                  title={i18n['trader.account.manage.allow.apply']}
                  onChange={this.handleChangeRights(field)}
                  disabled={isDisabled}
                >
                  {i18n['trader.account.manage.allow.apply']}
                </Checkbox>
              </Form.Control>
            </Form.Item>
          );
        })}
      </Form>
    );
  }
}
