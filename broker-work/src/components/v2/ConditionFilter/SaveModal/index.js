import { Button, Icon, Dialog, Input } from 'lean-ui';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import Form from 'components/Form';
import { FormControl } from 'react-bootstrap';
import AdvancedSearch from 'components/v2/AdvancedSearch';
import cs from '../AdvancedSearch.less';
export default class TipsModal extends PureComponent {
  state = {
    value: this.props.name || '',
    showConditions: true
  };
  onChangeName = e => {
    const value = e.target.value;
    this.setState({
      value
    });
  };
  onSave = (data, logicType, originData) => {
    const { onSave, showTopAlert } = this.props;
    const { value } = this.state;
    if (value && value.trim() !== '') {
      onSave(value, originData, logicType);
    } else {
      showTopAlert({
        content: i18n['settings.conditions_setting.null_tips']
      });
    }
  };

  toggleShowConditions = toggle => {
    this.setState({
      showConditions: toggle
    });
  };

  onSubmitForm = () => {
    const container = this.refs.advancedSearch;
    const wrapInstance =
      container &&
      container.getWrappedInstance &&
      container.getWrappedInstance();
    if (wrapInstance && wrapInstance.submitForm) {
      wrapInstance.submitForm();
    }
  };

  render() {
    const {
      onHide,
      disableValueConditions,
      data,
      logicType,
      disabled,
      saveType,
      onRemoveCondition
    } = this.props;
    const { value, showConditions } = this.state;
    return (
      <Dialog
        title={
          saveType === 'add'
            ? i18n['advanced_search.create_conditions']
            : i18n['advanced_search.save_conditions']
        }
        okText={saveType === 'add' ? i18n['general.add'] : i18n['general.save']}
        cancelText={i18n['general.cancel']}
        className={cs['condition-dialog']}
        visible={true}
        onCancel={onHide}
        footer={
          <div>
            {saveType === 'edit' && !disabled ? (
              <Button onClick={onRemoveCondition}>
                <Icon icon="delete" />
              </Button>
            ) : (
              undefined
            )}
            {!disabled ? (
              <Button onClick={this.onSubmitForm} type="primary">
                {i18n['tipsmodal.confirm']}
              </Button>
            ) : (
              undefined
            )}
            <Button onClick={onHide}>{i18n['tipsmodal.cancel']}</Button>
          </div>
        }
      >
        <Form.Label> {i18n['advanced_search.form.template_name']} </Form.Label>
        <Input
          type="text"
          disabled={disabled}
          value={value}
          onChange={this.onChangeName}
        />{' '}
        {/* {i18n['advanced_search.form.template_conditions']}{' '} */}
        <div
          className={cs['conditions-toggle']}
          onClick={this.toggleShowConditions.bind(this, !showConditions)}
        >
          {showConditions ? (
            <span className="main-color">
              <Icon icon="arrow-up" className="main-color" />{' '}
              {i18n['advanced_search.hide_conditions']}
            </span>
          ) : (
            <span className="main-color">
              <Icon icon="arrow-down" className="main-color" />{' '}
              {i18n['advanced_search.show_conditions']}
            </span>
          )}
        </div>
        <div
          className={
            showConditions ? cs['condition-show'] : cs['condition-hide']
          }
        >
          <AdvancedSearch
            {...this.props}
            onSearch={this.onSave}
            initData={data}
            inner
            logicType={logicType}
            disabled={disabled}
            ref="advancedSearch"
          />
        </div>
      </Dialog>
    );
  }
}
