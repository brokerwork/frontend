import { Button, Table, Icon } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './List.less';

const TTd = Table.Td;
import {
  AUDIT_STATE,
  AUDIT_STATES_SUBMIT,
  AUDIT_STATES_AUDITTING,
  AUDIT_STATES_SUBMIT_FAILD,
  AUDIT_STATES_AUDIT_FAILD
} from '../../../../constant';

export default class SmsList extends PureComponent {
  showErrorMessage = data => {
    const { showTipsModal } = this.props;
    showTipsModal({
      content: data,
      noCancel: true
    });
  };
  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };
  render() {
    const { messageType, toggleEdit, onDelete, onPreview } = this.props;
    let data = [];
    this.props.data &&
      this.props.data.forEach((item, index) => {
        const typeItem = messageType.find(type => type.value === item.type);
        const isAllowedUpdate = ![
          AUDIT_STATES_AUDITTING,
          AUDIT_STATES_SUBMIT
        ].includes(item.auditState);
        const stateStyle =
          item.auditState && `state_${item.auditState.toLowerCase()}`;
        data.push({
          key1: item.id,
          key2: typeItem && typeItem.label,
          key3: item.title,
          key4: item.content,
          key5: item.createDate,
          key6: [AUDIT_STATES_SUBMIT_FAILD, AUDIT_STATES_AUDIT_FAILD].includes(
            item.auditState
          ) ? (
            <a
              title={i18n['setting.message.template.message_status.faild_tips']}
              className={cs[stateStyle]}
              onClick={this.showErrorMessage.bind(this, item.auditInfo)}
            >
              {AUDIT_STATE[item.auditState]}
            </a>
          ) : (
            <span className={cs[stateStyle]}>
              {AUDIT_STATE[item.auditState]}
            </span>
          ),
          key7: (
            <div className={cs['list-button']}>
              <span
                className={`${cs['operationIcon']} main-color`}
                title={i18n['settings.message_template.preview']}
                onClick={onPreview.bind(this, item)}
              >
                <Icon fontType="bw" icon="preview" />
              </span>
              {isAllowedUpdate ? (
                <span
                  className={`${cs['operationIcon']} main-color`}
                  title={i18n['general.edit']}
                  onClick={toggleEdit.bind(this, item)}
                >
                  <Icon icon="edit-outline" />
                </span>
              ) : null}
              <span
                className={`${cs['operationIcon']} main-color`}
                title={i18n['general.delete']}
                onClick={onDelete.bind(this, item)}
              >
                <Icon icon="delete-outline" />
              </span>
            </div>
          )
        });
      });
    const columns = [
      { key: 'key1', name: i18n['settings.message_template.template_no'] },
      { key: 'key2', name: i18n['settings.message_template.type'] },
      { key: 'key3', name: i18n['settings.message_template.title'] },
      { key: 'key4', name: i18n['settings.message_template.content'] },
      { key: 'key5', name: i18n['settings.message_template.create_time'] },
      { key: 'key6', name: i18n['settings.message_template.status'] },
      { key: 'key7', name: i18n['settings.message_template.action'] }
    ];
    return (
      <div className={cs['list-table']}>
        <Table data={data} columns={columns} renderCell={this.renderCell} />
      </div>
    );
  }
}
