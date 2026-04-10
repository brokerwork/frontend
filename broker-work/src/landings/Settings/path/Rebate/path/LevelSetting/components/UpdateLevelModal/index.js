import i18n from 'utils/i18n';
import { Dialog, Button, InputNumber, Input } from 'lean-ui';

import cs from './UpdateLevelModal.less';

export default class UpdateLevelModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newLevel: this.props.type === 'edit' ? this.props.currentLevel : {},
      nameRequired: false,
      sidRequired: false,
      saveDisabled: false
    };
  }
  onSave = () => {
    const { onSave, length, type, isPro } = this.props;
    const { newLevel } = this.state;
    const maxLevel = isPro ? 200 : 50;
    if (!newLevel.name) {
      this.setState({
        nameRequired: true,
        saveDisabled: true
      });
      return;
    }

    if (parseInt(newLevel.sid) > maxLevel || parseInt(newLevel.sid) <= 0) {
      this.setState({
        sidRequired: true,
        saveDisabled: true
      });
      return;
    }

    const targetLevel = length + 1;
    if (parseInt(newLevel.sid) > targetLevel) {
      this.setState({
        sidRequired: true,
        saveDisabled: true
      });
      return;
    }

    onSave(type, newLevel);
  };

  setSid = e => {
    const { newLevel, nameRequired } = this.state;
    const { length, isPro } = this.props;
    const maxLevel = isPro ? 200 : 50;
    const v = e;
    let copyData = Object.assign({}, newLevel);
    copyData.sid = v;
    const targetLevel = length + 1;
    if (v > targetLevel) {
      this.setState({
        newLevel: copyData,
        sidRequired: true,
        saveDisabled: true
      });
      return;
    }

    if (parseInt(v) > maxLevel || parseInt(v) <= 0) {
      this.setState({
        newLevel: copyData,
        sidRequired: true,
        saveDisabled: true
      });
      return;
    }

    this.setState({
      newLevel: copyData,
      sidRequired: false,
      saveDisabled: !!nameRequired
    });
  };

  setName = e => {
    const { newLevel, sidRequired } = this.state;
    const v = e.target.value;
    let copyData = Object.assign({}, newLevel);
    copyData.name = v;
    if (!v) {
      this.setState({
        newLevel: copyData,
        nameRequired: true,
        saveDisabled: true
      });
    }

    this.setState({
      newLevel: copyData,
      nameRequired: false,
      saveDisabled: !!sidRequired
    });
  };

  render() {
    const { onHide, type, currentLevel, length, isPro } = this.props;
    console.log('isPro', isPro);
    const { newLevel, nameRequired, sidRequired, saveDisabled } = this.state;
    const tipLevel = isPro
      ? length >= 100
        ? 100
        : length + 1
      : length >= 50
        ? 50
        : length + 1;
    return (
      <Dialog
        title={
          type === 'edit'
            ? i18n['settings.level_setting.edit_level_title']
            : i18n['settings.level_setting.add_level_title']
        }
        visible={true}
        onCancel={onHide}
        footer={
          <Button type="primary" disabled={saveDisabled} onClick={this.onSave}>
            {i18n['general.confirm']}
          </Button>
        }
      >
        <div className="form-horizontal">
          <div className="form-group">
            <label className={`col-sm-3 control-label ${cs['label']}`}>
              {i18n['settings.level_setting.level_no']}:
            </label>
            {type === 'add' ? (
              <div className="col-sm-8">
                <InputNumber
                  className={`${sidRequired ? cs['error'] : ''}`}
                  placeholder={`${
                    i18n['settings.level_setting.add_level_sid_tips']
                  }${tipLevel}`}
                  step={1}
                  min={1}
                  defaultValue={newLevel.sid}
                  onChange={this.setSid}
                />
                {sidRequired ? (
                  <div className={cs['errorText']}>{`${
                    i18n['settings.level_setting.add_level_sid_tips']
                  }${tipLevel}`}</div>
                ) : (
                  undefined
                )}
              </div>
            ) : (
              <div className="col-sm-8 level-default">{currentLevel.sid}</div>
            )}
          </div>
          <div className="form-group">
            <label className={`col-sm-3 required control-label ${cs['label']}`}>
              {i18n['settings.level_setting.level_name']} :{' '}
            </label>
            <div className="col-sm-8">
              <Input
                className={`form-control ${nameRequired ? cs['error'] : ''}`}
                maxLength="40"
                defaultValue={newLevel.name}
                onChange={this.setName}
              />
              {nameRequired ? (
                <div className={cs['errorText']}>
                  {i18n['settings.role_setting.error_tints']}
                </div>
              ) : (
                undefined
              )}
            </div>
          </div>
          {type === 'edit' ? (
            <div className="form-group">
              <label className={`col-sm-3 control-label ${cs['label']}`}>
                {i18n['settings.level_setting.relative_user_label']} :
              </label>
              <div className="col-sm-8 level-default">
                {currentLevel.userCount}
              </div>
            </div>
          ) : (
            undefined
          )}
        </div>
      </Dialog>
    );
  }
}
