import { Button, Table, Icon } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './List.less';

const TTd = Table.Td;

export default class List extends PureComponent {
  renderCell = ({ key, data, index }) => {
    return <TTd key={index}>{data}</TTd>;
  };
  render() {
    const { messageType, toggleEdit, onDelete, onPreview } = this.props;
    let data = [];
    this.props.data &&
      this.props.data.forEach((item, index) => {
        const typeItem = messageType.find(type => type.value === item.type);
        data.push({
          key1: item.id,
          key2: typeItem && typeItem.label,
          key3: item.title,
          key4: item.name,
          key5: item.createDate,
          key6: (
            <div className={cs['list-button']}>
              <span
                className={`${cs['operationIcon']} main-color`}
                title={i18n['settings.message_template.preview']}
                onClick={onPreview.bind(this, item)}
              >
                <Icon icon="preview" fontType="bw" />
              </span>
              <span
                className={`${cs['operationIcon']} main-color`}
                title={i18n['general.edit']}
                onClick={toggleEdit.bind(this, item)}
              >
                <Icon icon="edit-outline" />
              </span>
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
      { key: 'key4', name: i18n['settings.message_template.name'] },
      { key: 'key5', name: i18n['settings.message_template.create_time'] },
      { key: 'key6', name: i18n['settings.message_template.action'] }
    ];
    return (
      <div className={cs['list-table']}>
        <Table data={data} columns={columns} renderCell={this.renderCell} />
      </div>
    );
  }
}
