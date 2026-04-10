import { SubmissionError } from 'redux-form';
import { required } from 'utils/renderField';
import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import cs from './DistributionParameterSetting.less';
import ParameterForm, { PARAMETER_FORM } from './Form';
import DirectSubsForm, { DIRECT_SUBS_FORM } from './DirectSubsForm';
import SubSubsForm, { SUB_SUBS_FORM } from './SubSubsForm';
import MultiSubsForm, { MULTI_SUB_SUBS_FORM } from './MultiSubSubsForm';
import { Message } from 'lean-ui';

const formMap = {
  directSubs: DIRECT_SUBS_FORM,
  subSubs: SUB_SUBS_FORM,
  multiSub: MULTI_SUB_SUBS_FORM
};

export default class DistributionParameterSetting extends PureComponent {
  state = {
    detail: {},
    directSubs: {},
    subSubs: {},
    multiSub: {},
    directRelationList: [],
    directCommissionTypeList: [],
    subRelationList: [],
    subSubsRelationList: [],
    subCommissionTypeList: [],
    multiSubsRelationList: [],
    multiSubsCommissionTypeList: []
  };

  componentDidMount(props) {
    const { getRuleDetail, selectedRule } = this.props;

    getRuleDetail(selectedRule.id).then(({ result, data }) => {
      if (result) {
        const detail = data[0] || {};

        this.setState(
          {
            detail: {
              ...detail,
              ruleType: 2,
              ruleId: selectedRule.id
            }
          },
          () => {
            this.setState({
              ...this.filterDirectDropdownList(),
              ...this.filterSubDropdownList(),
              ...this.filterMultiSubDropdownList()
            });
          }
        );
      }
    });
  }

  filterDirectDropdownList = () => {
    const {
      parentSubRelationList,
      distributionCommissionTypeList
    } = this.props;
    const { detail } = this.state;
    let copyRelationList = parentSubRelationList;
    let copyCommissionTypeList = distributionCommissionTypeList;

    if (detail.directSubs && detail.directSubs.length) {
      let resultRelationList = [];

      parentSubRelationList.forEach(item => {
        if (
          !detail.directSubs.some(_item => _item.parentSubType == item.value)
        ) {
          resultRelationList.push(item);
        }
      });

      copyRelationList = resultRelationList;
    }

    return {
      directRelationList: copyRelationList,
      directCommissionTypeList: copyCommissionTypeList
    };
  };

  filterSubDropdownList = () => {
    const {
      parentDirSubRelationList,
      subSubRelationList,
      distributionIndiCommissionTypeList
    } = this.props;
    const { detail, subSubs } = this.state;
    let copyRelationList = parentDirSubRelationList;
    let copySubRelationList = subSubRelationList;
    let copyCommissionTypeList = distributionIndiCommissionTypeList;

    if (detail.subSubs && detail.subSubs.length) {
      let resultRelationList = [];
      let resultSubRelationList = [];

      parentDirSubRelationList.forEach(item => {
        if (
          detail.subSubs.filter(_item => _item.parentSubType == item.value)
            .length !== subSubRelationList.length
        ) {
          resultRelationList.push(item);
        }
      });

      subSubRelationList.forEach(item => {
        if (
          detail.subSubs.filter(_item => _item.subSubType == item.value)
            .length !== parentDirSubRelationList.length
        ) {
          resultSubRelationList.push(item);
        }
      });

      if (subSubs.parentSubType) {
        const exist = detail.subSubs.filter(
          item => item.parentSubType == subSubs.parentSubType
        );

        resultSubRelationList = resultSubRelationList.filter(
          item => !exist.some(_item => _item.subSubType == item.value)
        );
      }

      if (subSubs.subSubType) {
        const exist = detail.subSubs.filter(
          item => item.subSubType == subSubs.subSubType
        );

        resultRelationList = resultRelationList.filter(
          item => !exist.some(_item => _item.parentSubType == item.value)
        );
      }

      copyRelationList = resultRelationList;
      copySubRelationList = resultSubRelationList;
    }

    return {
      subRelationList: copyRelationList,
      subSubsRelationList: copySubRelationList,
      subCommissionTypeList: copyCommissionTypeList
    };
  };

  filterMultiSubDropdownList = () => {
    const { multiSubRelationList, multiCommissionTypeList } = this.props;
    const { detail } = this.state;
    let copyRelationList = multiSubRelationList;
    let copyCommissionTypeList = multiCommissionTypeList;

    if (detail.multiSub && detail.multiSub.length) {
      let resultRelationList = [];

      multiSubRelationList.forEach(item => {
        if (!detail.multiSub.some(_item => _item.parentSubType == item.value)) {
          resultRelationList.push(item);
        }
      });

      copyRelationList = resultRelationList;
    }

    return {
      multiSubsRelationList: copyRelationList,
      multiSubsCommissionTypeList: copyCommissionTypeList
    };
  };

  changeLogic = (key, value) => {
    this.setState(
      {
        [key]: value
      },
      () => {
        this.setState({
          ...this.filterDirectDropdownList(),
          ...this.filterSubDropdownList(),
          ...this.filterMultiSubDropdownList()
        });
      }
    );
  };

  addLogic = (key, data) => {
    const { resetForm } = this.props;
    const { detail } = this.state;
    const copyData = JSON.parse(JSON.stringify(data));
    const copyDetail = JSON.parse(JSON.stringify(detail));

    if (!copyDetail[key]) copyDetail[key] = [];

    if (copyData.commissionType == 0 || copyData.commissionType == 4) {
      delete copyData.value;
    }

    copyDetail[key].push(copyData);

    this.setState(
      {
        detail: copyDetail,
        [key]: {}
      },
      () => {
        resetForm(formMap[key]);
        this.setState({
          ...this.filterDirectDropdownList(),
          ...this.filterSubDropdownList(),
          ...this.filterMultiSubDropdownList()
        });
      }
    );
  };

  removeLogic = (key, idx) => {
    const { detail } = this.state;
    const copyData = JSON.parse(JSON.stringify(detail));

    copyData[key].splice(idx, 1);

    this.setState(
      {
        detail: copyData
      },
      () => {
        this.setState({
          ...this.filterDirectDropdownList(),
          ...this.filterSubDropdownList(),
          ...this.filterMultiSubDropdownList()
        });
      }
    );
  };

  update = data => {
    const { detail, directSubs, subSubs, multiSub } = this.state;
    const { updateRuleDetail, levelList } = this.props;
    const copyDetail = JSON.parse(JSON.stringify(detail));
    const copyData = JSON.parse(JSON.stringify(data));
    const levels = [];

    levelList.forEach(item => {
      levels.push({
        levelId: item.id,
        value: copyData[`levelId_${item.id}`]
      });
    });

    copyDetail.levels = levels;

    if (
      directSubs.parentSubType &&
      directSubs.commissionType &&
      (directSubs.commissionType != 0 ? directSubs.value : true)
    ) {
      if (!copyDetail.directSubs) copyDetail.directSubs = [];

      copyDetail.directSubs.push(directSubs);
    }

    if (
      subSubs.parentSubType &&
      subSubs.subSubType &&
      subSubs.commissionType &&
      (subSubs.commissionType != 0 && subSubs.commissionType != 4
        ? subSubs.value
        : true)
    ) {
      if (!copyDetail.subSubs) copyDetail.subSubs = [];

      copyDetail.subSubs.push(subSubs);
    }

    if (
      multiSub.parentSubType &&
      multiSub.commissionType &&
      (multiSub.commissionType != 0 && multiSub.commissionType != 4
        ? subSubs.value
        : true) &&
      (multiSub.parentSubType == 1 && multiSub.levelEqualEnable == 1
        ? multiSub.levels
        : true)
    ) {
      if (!copyDetail.multiSub) copyDetail.multiSub = [];

      copyDetail.multiSub.push(multiSub);
    }

    updateRuleDetail(copyDetail).then(({ result }) => {
      if (result) {
        Message.success(i18n['general.save_success']);
      }
      this.onHide();
    });
  };

  onHide = () => {
    const { onHide } = this.props;

    onHide();
  };

  sumbitLevels = values => {
    const { levelList } = this.props;
    const errors = {};

    levelList.forEach(item => {
      if (required(values[`levelId_${item.id}`])) {
        errors[`levelId_${item.id}`] = required(values[`levelId_${item.id}`]);
      }
    });

    if (Object.keys(errors).length) {
      throw new SubmissionError(errors);
    }

    return values;
  };

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(PARAMETER_FORM);
  };

  getLevels = () => {
    const { detail } = this.state;
    const levels = {};

    if (!detail.levels) return {};

    detail.levels.forEach(item => {
      levels[`levelId_${item.levelId}`] = item.value;
    });

    return levels;
  };

  render() {
    const {
      detail,
      directSubs,
      subSubs,
      multiSub,
      directRelationList,
      directCommissionTypeList,
      subRelationList,
      subSubsRelationList,
      subCommissionTypeList,
      multiSubsRelationList,
      multiSubsCommissionTypeList
    } = this.state;
    const {
      selectedRule,
      parentSubRelationList,
      distributionCommissionTypeList,
      distributionIndiCommissionTypeList,
      parentDirSubRelationList,
      subSubRelationList,
      levelList,
      multiSubRelationList,
      multiCommissionTypeList
    } = this.props;
    const levels = this.getLevels();

    return (
      <Modal
        backdrop="static"
        bsSize="large"
        show={true}
        onHide={this.onHide}
        className={cs['parameter-modal']}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage
              id="settings.rebate_setting.edit_parameter_title"
              defaultMessage={
                i18n['settings.rebate_setting.edit_parameter_title']
              }
              values={{ name: selectedRule.name }}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={cs['modal-body']}>
          <h3 className={cs['heading']}>
            {i18n['settings.rebate_setting.distribution.levels']}
          </h3>
          <ParameterForm
            levelList={levelList}
            initialValues={levels}
            onSubmit={this.sumbitLevels}
            onSubmitSuccess={this.update}
          />
          {selectedRule.cycleLevel <= 3 ? (
            <div>
              {selectedRule.cycleLevel > 1 ? (
                <div>
                  <h3 className={cs['heading']}>
                    {i18n['settings.rebate_setting.distribution.direct_subs']}
                  </h3>
                  <DirectSubsForm
                    onChange={this.changeLogic.bind(this, 'directSubs')}
                    onSubmitSuccess={this.addLogic.bind(this, 'directSubs')}
                    directSubsList={detail.directSubs}
                    initialValues={directSubs}
                    relationList={directRelationList}
                    commissionTypeList={directCommissionTypeList}
                  />
                  <table className={cs['logic-table']}>
                    <tbody>
                      {detail.directSubs && detail.directSubs.length ? (
                        <tr>
                          <td colSpan="3">
                            <i className="fa fa-check-circle" />
                            {i18n['settings.rebate_setting.exist_logic']}
                          </td>
                        </tr>
                      ) : (
                        undefined
                      )}
                      {detail.directSubs && detail.directSubs.length
                        ? detail.directSubs.map((item, idx) => {
                            return (
                              <tr key={idx}>
                                <td colSpan="3">
                                  {i18n['settings.rebate_setting.if']}
                                  {
                                    parentSubRelationList.find(
                                      _item => _item.value == item.parentSubType
                                    ).label
                                  }
                                  {i18n['general.dot']}
                                  {i18n['settings.rebate_setting.then']}
                                  {
                                    distributionCommissionTypeList.find(
                                      _item =>
                                        _item.value == item.commissionType
                                    ).label
                                  }
                                  {item.commissionType == '1' ? (
                                    <span>{`${item.value}${i18n[
                                      'settings.rebate_setting.distribution.volume'
                                    ]}`}</span>
                                  ) : item.commissionType == '2' ||
                                  item.commissionType == '3' ? (
                                    <span>{`${item.value}%`}</span>
                                  ) : (
                                    undefined
                                  )}
                                  <Button
                                    className={cs['remove-btn']}
                                    onClick={this.removeLogic.bind(
                                      this,
                                      'directSubs',
                                      idx
                                    )}
                                  >
                                    <i className="fa fa-times-circle" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        : undefined}
                    </tbody>
                  </table>
                </div>
              ) : (
                undefined
              )}
              {selectedRule.cycleLevel === 3 ? (
                <div>
                  <h3 className={cs['heading']}>
                    {i18n['settings.rebate_setting.distribution.sub_subs']}
                  </h3>
                  <SubSubsForm
                    onChange={this.changeLogic.bind(this, 'subSubs')}
                    onSubmitSuccess={this.addLogic.bind(this, 'subSubs')}
                    initialValues={subSubs}
                    relationList={subRelationList}
                    subRelationList={subSubsRelationList}
                    subSubsList={detail.subSubs}
                    commissionTypeList={subCommissionTypeList}
                  />
                  <table className={cs['logic-table']}>
                    <tbody>
                      {detail.subSubs && detail.subSubs.length ? (
                        <tr>
                          <td colSpan="3">
                            <i className="fa fa-check-circle" />
                            {i18n['settings.rebate_setting.exist_logic']}
                          </td>
                        </tr>
                      ) : (
                        undefined
                      )}
                      {detail.subSubs && detail.subSubs.length
                        ? detail.subSubs.map((item, idx) => {
                            return (
                              <tr key={idx}>
                                <td colSpan="3">
                                  {i18n['settings.rebate_setting.if']}
                                  {
                                    parentDirSubRelationList.find(
                                      _item => _item.value == item.parentSubType
                                    ).label
                                  }
                                  {i18n['settings.rebate_setting.and']}
                                  {
                                    subSubRelationList.find(
                                      _item => _item.value == item.subSubType
                                    ).label
                                  }
                                  {i18n['general.dot']}
                                  {i18n['settings.rebate_setting.then']}
                                  {
                                    distributionIndiCommissionTypeList.find(
                                      _item =>
                                        _item.value == item.commissionType
                                    ).label
                                  }
                                  {item.commissionType == '1' ? (
                                    <span>{`${item.value}${i18n[
                                      'settings.rebate_setting.distribution.volume'
                                    ]}`}</span>
                                  ) : item.commissionType == '2' ||
                                  item.commissionType == '3' ? (
                                    <span>{`${item.value}%`}</span>
                                  ) : (
                                    undefined
                                  )}
                                  <Button
                                    className={cs['remove-btn']}
                                    onClick={this.removeLogic.bind(
                                      this,
                                      'subSubs',
                                      idx
                                    )}
                                  >
                                    <i className="fa fa-times-circle" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        : undefined}
                    </tbody>
                  </table>
                </div>
              ) : (
                undefined
              )}
            </div>
          ) : (
            <div>
              <h3 className={cs['heading']}>
                {i18n['settings.rebate_setting.distribution.sub_subs']}
              </h3>
              <MultiSubsForm
                onChange={this.changeLogic.bind(this, 'multiSub')}
                onSubmitSuccess={this.addLogic.bind(this, 'multiSub')}
                initialValues={multiSub}
                relationList={multiSubsRelationList}
                multiSubsList={detail.multiSub}
                commissionTypeList={multiSubsCommissionTypeList}
                cycleLevel={selectedRule.cycleLevel}
              />
              <table className={cs['logic-table']}>
                <tbody>
                  {detail.multiSub && detail.multiSub.length ? (
                    <tr>
                      <td colSpan="3">
                        <i className="fa fa-check-circle" />
                        {i18n['settings.rebate_setting.exist_logic']}
                      </td>
                    </tr>
                  ) : (
                    undefined
                  )}
                  {detail.multiSub && detail.multiSub.length
                    ? detail.multiSub.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td colSpan="3">
                              {i18n['settings.rebate_setting.if']}
                              {
                                multiSubRelationList.find(
                                  _item => _item.value == item.parentSubType
                                ).label
                              }
                              {i18n['general.dot']}
                              {i18n['settings.rebate_setting.then']}
                              {
                                multiCommissionTypeList.find(
                                  _item => _item.value == item.commissionType
                                ).label
                              }
                              {item.commissionType == '1' ? (
                                <span>{`${item.value}${i18n[
                                  'settings.rebate_setting.distribution.volume'
                                ]}`}</span>
                              ) : item.commissionType == '2' ||
                              item.commissionType == '3' ? (
                                <span>{`${item.value}%`}</span>
                              ) : (
                                undefined
                              )}
                              {item.levelEqualEnable == '1' ? (
                                <span>
                                  {i18n['general.dot']}
                                  {
                                    i18n[
                                      'setting.rebate_setting.distribution.level_limit'
                                    ]
                                  }{' '}
                                  {item.levels}{' '}
                                  {
                                    i18n[
                                      'setting.rebate_setting.distribution.level_label'
                                    ]
                                  }
                                </span>
                              ) : (
                                undefined
                              )}
                              <Button
                                className={cs['remove-btn']}
                                onClick={this.removeLogic.bind(
                                  this,
                                  'multiSub',
                                  idx
                                )}
                              >
                                <i className="fa fa-times-circle" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    : undefined}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={this.onHide}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
