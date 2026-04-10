import Table from 'components/FixTable';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import Modal from 'components/Modal';
import _ from 'lodash';
import { SENSITIVE_FIELD_TYPE } from '../../constant';
import cs from './index.less';
const sortOptions = {
  filter: '.disable_drag',
  draggable: '.enable_drag'
};
export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      selectType: 0,
      selectOptions: null
    };
  }
  componentDidMount() {
    // this.props.getFieldType();
    const { stepOptionList } = this.props;
    this.setState({
      selectType: stepOptionList && stepOptionList.length && stepOptionList[0].value
    });
  }
  renderHeader = () => {
    return this.props.columns.map(col => {
      let content = i18n[`field.setting.field.${col.key}`];
      if (['sort', 'operation'].includes(col.key)) {
        content = i18n[`general.${col.key}`];
      }
      return <th key={col.key}>{content}</th>;
    });
  };
  renderTableBody = (data, sort) => {
    return data && data.length ? data.map((item, key) => this.renderCell(item, key, sort)) : null;
  };
  renderCell = (item, key, sort) => {
    const { columns, fieldType, isEnabled, sortableData, dissortableData, type } = this.props;
    return (
      <tr className={sort ? 'enable_drag' : 'disable_drag'} key={sort ? `sort${item.key}${key}` : `${item.key}${key}`}>
        {columns.map(col => {
          let content = '';
          switch (col.key) {
            case 'sort':
              content = sort ? <i className="fa fa-bars" /> : null;
              break;
            case 'fieldType':
              const findField = fieldType.find(f => f.value === item[col.key]);
              content = _.get(findField, 'label', '');
              break;
            case 'relationFunc':
              content = item.sysDefault ? (
                '--'
              ) : (
                <i className={`fa fa-${item.relationFunc || item.relation ? 'check' : 'times'}`} />
              );
              break;
            case 'required':
            case 'overuse':
              content = <i className={`fa fa-${item[col.key] ? 'check' : 'times'}`} />;
              break;
            case 'sensitive':
              content = !SENSITIVE_FIELD_TYPE.includes(item.fieldType) ? (
                <i className={`fa fa-${item[col.key] ? 'check' : 'times'}`} />
              ) : (
                '--'
              );
              break;
            case 'attr':
              content = item.sysDefault
                ? i18n['field.setting.field.system']
                : item.userCustom
                ? i18n['field.setting.field.custom']
                : i18n['field.setting.field-list.key'];
              break;
            case 'enable':
              content = sort ? (
                <span style={{ color: 'green' }}>{i18n['common.tips.enable']}</span>
              ) : (
                <span style={{ color: 'red' }}>{i18n['common.tips.disable']}</span>
              );
              break;
            case 'operation':
              const params = {
                item,
                key,
                type,
                sort
              };
              content = (
                <div>
                  {item.key === 'accountName' ? (
                    <Button style="primary" className="icon" onClick={this.modify}>
                      <i className="fa fa-pencil" />
                    </Button>
                  ) : sort ? (
                    <Button className="icon" onClick={isEnabled.bind(this, sortableData, dissortableData, params)}>
                      <i className="fa fa-ban" />
                    </Button>
                  ) : (
                    <Button
                      style="primary"
                      className="icon"
                      onClick={isEnabled.bind(this, dissortableData, sortableData, params)}
                    >
                      <i className="fa fa-check-circle" />
                    </Button>
                  )}
                </div>
              );
              break;
            case 'name':
              content = item[col.key] || item['label'];
              break;
            default:
              content = item[col.key];
          }
          return <td key={col.key}>{content}</td>;
        })}
      </tr>
    );
  };
  modify = () => {
    this.props.isVisibleShow(this.props.type, 'row');
  };

  render() {
    const { sortableData, dissortableData, onSort, type, columns, stepOptionList } = this.props;
    const { isVisible, selectType } = this.state;
    return (
      <div className={cs.list_container}>
        <Table>
          <Table.Header fixHeader={true} data={columns}>
            {this.renderHeader()}
          </Table.Header>
          <Table.Body sortable onSort={onSort(type)} sortOptions={sortOptions} data={columns}>
            {this.renderTableBody(sortableData, true)}
            {this.renderTableBody(dissortableData, false)}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
