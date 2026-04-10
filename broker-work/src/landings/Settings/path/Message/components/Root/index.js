import { Card, Button, Icon } from 'lean-ui';
import { Component } from 'react';
import NoDataView from 'components/v2/NoDataView';

import List from '../List';
import SmsList from '../List/SmsList';
import Modify from '../../container/Modify';
import ActionBar from '../ActionBar';
import i18n from 'utils/i18n';
import cs from './Root.less';
import { MESSAGE_TYPE_SMS } from '../../../../constant';
import SettingActionBar from 'landings/Settings/components/SettingActionBar';

const TEMPLATES_TYPE_MAP = {
  mail: 0,
  popup: 1,
  system: 2,
  message: 3
};
export default class MessageTemplate extends Component {
  state = {
    showAddModal: false,
    showEditModal: false
  };

  matchParamsType = props => {
    const { match: { params: { type = '' } } = {} } = props;
    return TEMPLATES_TYPE_MAP[type] || 0;
  };

  componentWillReceiveProps(nextProps) {
    //判断状态的改变
    const current = this.matchParamsType(this.props);
    const next = this.matchParamsType(nextProps);
    if (current !== next) {
      this.refreshData(next);
    }
  }

  refreshData = index => {
    const { modifyParams, messageType } = this.props;
    if (!messageType.length) return;
    Promise.resolve(modifyParams({ type: messageType[index].value })).then(
      () => {
        this.getTemplates();
      }
    );
  };

  componentDidMount() {
    const index = this.matchParamsType(this.props);
    this.refreshData(index);
  }

  getTemplates = () => {
    const { params, getMessageTemplates } = this.props;
    return getMessageTemplates(params);
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };
  toggleEdit = (template = null) => {
    const { setCurrentTemplate } = this.props;
    Promise.resolve(setCurrentTemplate(template)).then(() => {
      this.toggleModal('Edit', Boolean(template));
    });
  };
  showPreview = selected => {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: selected.content,
      trust: true,
      noCancel: true,
      header: i18n['settings.message_template.preview']
    });
  };
  showConfirmModal = selected => {
    const { showTipsModal, showTopAlert, deleteMessageTemplate } = this.props;
    showTipsModal({
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        deleteMessageTemplate({ id: selected.id }).then(res => {
          if (res.result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            this.getTemplates();
          }
          cb();
        });
      }
    });
  };
  render() {
    const { params, modifyParams, messageType, data, userRights } = this.props;
    const { showAddModal, showEditModal } = this.state;
    const currentType = params && params.type;
    return (
      <div className={cs.body}>
        <SettingActionBar
          title={
            i18n[`settings.left_menu.message_setting.sub_menu.${currentType}`]
          }
        >
          {messageType.length ? (
            <Button
              type="primary"
              className={cs['right']}
              onClick={this.toggleModal.bind(this, 'Add', true)}
            >
              <Icon icon="add-outline" />
              {i18n['settings.role_setting.add_template']}
            </Button>
          ) : (
            undefined
          )}
        </SettingActionBar>
        <Card>
          {params.loading ? null : currentType === MESSAGE_TYPE_SMS ? (
            <SmsList
              {...this.props}
              data={data}
              messageType={messageType}
              userRights={userRights}
              toggleEdit={this.toggleEdit}
              onDelete={this.showConfirmModal}
              onPreview={this.showPreview}
            />
          ) : (
            <List
              data={data}
              messageType={messageType}
              userRights={userRights}
              toggleEdit={this.toggleEdit}
              onDelete={this.showConfirmModal}
              onPreview={this.showPreview}
            />
          )}
          {data.length === 0 ? <NoDataView /> : undefined}

          {showAddModal ? (
            <Modify
              type="add"
              title={
                i18n[
                  `settings.left_menu.message_setting.sub_menu.${currentType}`
                ]
              }
              onHide={this.toggleModal.bind(this, 'Add', false)}
              getTemplates={this.getTemplates}
              currentFormInfo={params}
            />
          ) : null}
          {showEditModal ? (
            <Modify
              type="edit"
              title={
                i18n[
                  `settings.left_menu.message_setting.sub_menu.${currentType}`
                ]
              }
              onHide={this.toggleEdit.bind(this, null)}
              getTemplates={this.getTemplates}
              currentFormInfo={params}
            />
          ) : null}
        </Card>
      </div>
    );
  }
}
