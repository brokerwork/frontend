import i18n from 'utils/i18n';
import { Dialog, Button, Message } from 'lean-ui';
import cs from './index.less';
import _ from 'lodash';
import DefaultParamsForm from './form';
const initialValues = {
  test: '0',
  test1: '0'
};
export default class SetDefaultParamsModal extends PureComponent {
  defaultParamsRef = null;
  onSave = () => {
    const { updateDefaultLevel, currentLevel, onHide } = this.props;
    const params = this.defaultParamsRef.submitData();
    updateDefaultLevel(currentLevel.id, params).then(res => {
      if (res.result) {
        Message.success(i18n['general.modify_success']);
        onHide();
      }
    });
  };
  configLevelList = (levelList, defaultLevel) => {
    return (
      levelList &&
      levelList.length &&
      levelList.map(level => {
        const findItem = _.get(defaultLevel, 'details', []).find(
          dl => dl.ruleId === level.ruleId
        );
        if (findItem) {
          level.ruleDetailId = findItem.ruleDetailId;
        }
        return level;
      })
    );
  };
  render() {
    const { visible, onHide, levelList, defaultLevel } = this.props;
    const defaultDevelList =
      this.configLevelList(levelList, defaultLevel) || [];
    return (
      <Dialog
        title={i18n['settings.level_setting.default_params_setting.title']}
        visible={visible}
        onCancel={onHide}
        footer={
          <div>
            <Button onClick={onHide}>{i18n['general.cancel']}</Button>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.confirm']}
            </Button>
          </div>
        }
      >
        <div>
          {defaultDevelList && defaultDevelList.length ? (
            <DefaultParamsForm
              levelList={defaultDevelList}
              ref={el => (this.defaultParamsRef = el)}
            />
          ) : (
            <span>
              {i18n['settings.level_setting.default_params_setting.nodata']}
            </span>
          )}
        </div>
      </Dialog>
    );
  }
}
