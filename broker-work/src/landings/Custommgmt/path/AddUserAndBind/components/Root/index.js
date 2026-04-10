import { isPositiveNumber } from 'utils/validate';
import i18n from 'utils/i18n';
import { setTrimString } from 'utils/trim';
import {
  Button,
  Panel,
  Tabs,
  Tab,
  Grid,
  Row,
  Col,
  ControlLabel
} from 'react-bootstrap';
import Modal from 'components/Modal';
import CardPanel from 'components/CardPanel';
import { post, get } from 'utils/ajax';
import { FormattedMessage } from 'react-intl';
import cs from './UpdateUserCard.less';
import { CardPanelWrapper } from 'components/CardPanel';
import { panelStateStyle } from 'react-bootstrap';
import Radio from 'components/Radio';
import { getRights } from './utils';
import MainPanel from './MainPanel';
import UserSelector from 'components/UserSelector';
import {
  USER_FORM_USER_INFO,
  USER_FORM_REAK_RULE,
  USER_FORM_AGENCT_INFO,
  USER_FORM_ACCOUNT_INFO
} from './MainPanel';

class ChangeOwnerModal extends PureComponent {
  state = {
    needChangeAll: null,
    radioError: false
  };
  onComplete = () => {
    const { onComplete } = this.props;
    onComplete();
  };
  onChangeOwnerSubmit = () => {
    const { needChangeAll } = this.state;
    const {
      changeBwUserOwner,
      customerInfo: { customerId },
      userInfo
    } = this.props;
    if (needChangeAll === null) {
      this.setState({
        radioError: true
      });
      return;
    }
    changeBwUserOwner({
      customerId,
      userId: userInfo.id,
      recursion: needChangeAll,
      userName: userInfo.name
    }).then(({ result }) => {
      if (result) {
        this.onComplete();
      } else return Promise.resolve({ result: false });
    });
  };
  render() {
    const { needChangeAll, radioError } = this.state;
    return (
      <Modal
        bsSize="sm"
        className={`${cs['modal-container']} ${panelStateStyle}`}
        show={true}
        onHide={this.onComplete}
      >
        <Modal.Header>
          <button type="button" className="close" onClick={this.onHide} />
          <Modal.Title id="tips-modal">{i18n['tipsmodal.title']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={cs['bind-success-tips-box']}>
            <h5>
              {i18n['customer.detail.bw_user_owner_change_modal.bind_success']}
            </h5>
            <p>
              {
                i18n[
                  'customer.detail.bw_user_owner_change_modal.bind_success_msg'
                ]
              }
            </p>
          </div>
          <br />
          <p>
            {
              i18n[
                'customer.detail.bw_user_owner_change_modal.select_owner_range'
              ]
            }
            :
          </p>
          <div>
            <Radio
              checked={needChangeAll === false}
              className={cs['radio-item']}
              onChange={() => {
                this.setState({ needChangeAll: false });
              }}
            >
              {
                i18n[
                  'customer.detail.bw_user_owner_change_modal.radio_rec_direct'
                ]
              }
            </Radio>
            <Radio
              checked={needChangeAll === true}
              className={cs['radio-item']}
              onChange={() => {
                this.setState({ needChangeAll: true });
              }}
            >
              {
                i18n[
                  'customer.detail.bw_user_owner_change_modal.radio_rec_direct_and_subs'
                ]
              }
            </Radio>
            {radioError ? (
              <div className="validate-error-msg">
                {i18n['customer.detail.bw_user_owner_change_modal.radio_error']}
              </div>
            ) : (
              undefined
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className={cs['button-bar']}>
            <Button bsStyle="primary" onClick={this.onChangeOwnerSubmit}>
              {
                i18n[
                  'customer.detail.bw_user_owner_change_modal.change_comfirm'
                ]
              }
            </Button>
            <Button onClick={this.onComplete}>{i18n['general.cancel']}</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default class UpdateUserCard extends PureComponent {
  state = {
    rightTabIndex: 1,
    selectedUser: null,
    shouldChangeOwner: false,
    selectUserError: false
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const {
      getUserLevel,
      modifyParams,
      getPasswordStrength,
      getUserRole,
      getServerList,
      getUpdateUserLevel,
      getFormColumns
    } = this.props;
    getFormColumns();
    getUserLevel().then(res => {
      if (!res.result) return Promise.resolve(res);
      const { params } = this.props;
      const levelId = res.data[0].value;
      const __params = {
        ...params,
        levelId
      };
      modifyParams(__params);
      getServerList();
      getUpdateUserLevel();
      getUserRole();
      getPasswordStrength();
    });
  }

  addCommissionInitValue = () => {
    const { upwardInitvalue, type } = this.props;

    const commissionUserInfo = {};
    if (type === 'add') {
      commissionUserInfo['levelId'] = 0;
      commissionUserInfo['levelName'] = null;
      commissionUserInfo['parent'] = 0;
      return commissionUserInfo;
    }

    return upwardInitvalue.commissionInitValues || {};
  };

  hideChangeOwnerModal = () => {
    this.setState({
      shouldChangeOwner: false
    });
  };

  onChangeOwnerComplete = () => {
    const { onHide, onBindComplete } = this.props;
    this.hideChangeOwnerModal();
    onHide();
    onBindComplete();
  };

  onClose = () => {
    const { onHide } = this.props;
    onHide();
  };
  //新增客户
  onSubmitUserInfo = finallyData => {
    const {
      addUser,
      showTopAlert,
      params,
      showTipsModal,
      checkSameLogin,
      customerInfo: { customerId },
      bindCtid
    } = this.props;
    if (typeof finallyData['sendEmail'] === 'undefined') {
      finallyData['sendEmail'] = true;
    }
    //全民代理绑定bw用户需要同时提交客户id
    finallyData['customerId'] = customerId;
    return addUser(finallyData).then(res => {
      if (!res.result) return Promise.resolve(res);
      // 创建完成后，执行绑定操作
      if (!!finallyData && finallyData['accountInfo-ctid'] && res.data.login) {
        bindCtid(res.data.login, finallyData['accountInfo-ctid'], {
          vendor: finallyData.vendor,
          serverId: finallyData.serverId
        });
      }
      this.bindCurrentUser(res.data, true);
      // 更新选中的用户数据
      this.setState({
        selectedUser: { _originData: res.data }
      });
      return Promise.resolve({ result: true });
    });
  };

  bindCurrentUser = (data, fromCreator) => {
    const {
      onUserBinding,
      bindBwUser,
      customerInfo: { customerId },
      showTopAlert,
      onBindComplete
    } = this.props;
    bindBwUser({
      customerId,
      userId: data.id,
      userName: data.name
    }).then(({ data, result }) => {
      if (!result) {
        showTopAlert({
          content:
            i18n[
              fromCreator
                ? 'customer.detail.bw_user_owner_change_modal.create_success_bind_failed'
                : 'customer.detail.bw_user_owner_change_modal.bind_failed'
            ],
          bsStyle: 'danger'
        });
        return;
      }
      // 如果存在归属修改，则进行归属修改稿的弹窗
      if (data === true) {
        this.setState({
          shouldChangeOwner: true
        });
      } else {
        showTopAlert({
          content:
            i18n[
              fromCreator
                ? 'customer.detail.bw_user_owner_change_modal.create_success_bind_success'
                : 'customer.detail.bw_user_owner_change_modal.bind_success'
            ],
          bsStyle: 'success'
        });
        this.onClose();
        onBindComplete();
      }
    });
  };

  onSave = () => {
    const { submitForm, showTopAlert } = this.props;
    const { rightTabIndex, selectedUser } = this.state;
    if (rightTabIndex === 1) {
      submitForm(USER_FORM_USER_INFO);
      submitForm(USER_FORM_REAK_RULE);
      submitForm(USER_FORM_AGENCT_INFO);
      submitForm(USER_FORM_ACCOUNT_INFO);
    } else {
      if (!!selectedUser && selectedUser._originData) {
        this.bindCurrentUser(selectedUser._originData);
      } else {
        this.setState({
          selectUserError: true
        });
      }
    }
  };

  render() {
    const {
      header,
      isShow,
      userRights,
      relationUserInfo,
      basicFormColumns
    } = this.props;
    const {
      rightTabIndex,
      selectedUser,
      shouldChangeOwner,
      selectUserError
    } = this.state;
    const rights = getRights(relationUserInfo, userRights);
    return (
      <div>
        {shouldChangeOwner && selectedUser ? (
          <ChangeOwnerModal
            {...this.props}
            userInfo={selectedUser && selectedUser._originData}
            onComplete={this.onChangeOwnerComplete}
          />
        ) : (
          undefined
        )}
        <CardPanelWrapper>
          {isShow ? (
            <CardPanel
              show={true}
              onClose={this.onClose}
              className={cs['container']}
              title={header}
            >
              <Tabs
                activeKey={rightTabIndex}
                id="followRecords"
                className={cs['follow-records']}
                onSelect={key => {
                  this.setState({ rightTabIndex: key });
                }}
              >
                <Tab
                  eventKey={1}
                  title={
                    i18n['customer.detail.bw_user_binding_card.creat_user_bind']
                  }
                >
                  {rightTabIndex === 1 &&
                  basicFormColumns &&
                  basicFormColumns.length > 0 ? (
                    <div className={cs['main-panel']}>
                      <MainPanel
                        {...this.props}
                        type="add"
                        onSubmitUserInfo={this.onSubmitUserInfo}
                        // hideMoreForm={true} //暂时屏蔽用户中的额外字段
                      />
                    </div>
                  ) : (
                    undefined
                  )}
                </Tab>
                <Tab
                  eventKey={2}
                  title={
                    i18n['customer.detail.bw_user_binding_card.bind_user_exist']
                  }
                >
                  {rightTabIndex === 2 ? (
                    <Grid className={cs['user-select-item']}>
                      <Row>
                        <Col
                          componentClass={ControlLabel}
                          sm={2}
                          className={cs['label']}
                        >
                          <span className="required" />
                          {
                            i18n[
                              'customer.detail.bw_user_binding_card.bind_user_exist_label'
                            ]
                          }
                          ：
                        </Col>
                        <Col xs={10}>
                          <UserSelector
                            url="/v1/user/findUnbindUserByField?includeAdmin=true"
                            value={selectedUser}
                            className={cs['binding-selector']}
                            searchByField
                            onSelect={selectData => {
                              this.setState({
                                selectedUser: selectData,
                                selectUserError: !selectData.value
                              });
                            }}
                          />
                          {selectUserError ? (
                            <div className="validate-error-msg">
                              {
                                i18n[
                                  'customer.detail.bw_user_binding_card.bind_user_require'
                                ]
                              }
                            </div>
                          ) : (
                            undefined
                          )}
                        </Col>
                      </Row>
                    </Grid>
                  ) : (
                    undefined
                  )}
                </Tab>
              </Tabs>

              <CardPanel.Footer>
                {rights.addBasicInfo ? (
                  <Button bsStyle="primary" onClick={this.onSave}>
                    {i18n['customer.detail.bw_user_binding_card.save_to_bind']}
                  </Button>
                ) : (
                  undefined
                )}
                <Button onClick={this.onClose}>{i18n['general.cancel']}</Button>
              </CardPanel.Footer>
            </CardPanel>
          ) : (
            undefined
          )}
        </CardPanelWrapper>
      </div>
    );
  }
}
