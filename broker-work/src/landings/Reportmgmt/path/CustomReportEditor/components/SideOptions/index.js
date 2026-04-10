import { Layout, Summary, Content, Sider } from 'components/v2/PageWraper';
import { Select, Icon, Popover } from 'lean-ui';
import cs from './index.less';
import i18n from 'utils/i18n';
import Sortable from 'sortablejs';

export default class SideOptions extends PureComponent {
  componentDidMount() {
    const options = {
      draggable: 'li',
      onSort: this.onSort
    };
    Sortable.create(this.refs.sortable, options);
  }
  onSort = data => {
    const { onFieldDrag } = this.props;
    const { oldIndex, newIndex } = data;
    if (oldIndex !== newIndex) {
      onFieldDrag({
        oldIndex,
        newIndex
      });
    }
  };
  render() {
    const {
      typeFields = [],
      typeFieldsSelected = [],
      onFieldSelect,
      onFieldRemove
    } = this.props;
    const typeFieldsSelectedIds = typeFieldsSelected.map(f => f.fieldId);
    const typeFieldsOptions = typeFields.filter(
      filed => !typeFieldsSelectedIds.includes(filed.fieldId)
    );
    return (
      <Layout>
        <Content className={cs['condiiton-filter-content']}>
          <h3>{i18n['report.custom_report.edit.edit_col']}</h3>
          <Select
            isSearch
            placeholder={i18n['report.custom_report.edit.add_col']}
            onSelect={select =>
              onFieldSelect(
                typeFieldsOptions.find(opt => opt.fieldId === select)
              )
            }
            value={''}
          >
            {typeFieldsOptions.map(opt => (
              <Select.Option key={opt.fieldId} value={opt.fieldId}>
                {opt.fieldName || opt.message}
              </Select.Option>
            ))}
          </Select>
          <ul className={cs['col-list']} ref="sortable">
            {typeFieldsSelected.map(selected => (
              <li key={selected.fieldId}>
                {selected.fieldName || selected.message}
                {selected.hint ? (
                  <Popover trigger="click" content={selected.hint}>
                    <Icon icon="question" className={cs['tip']} />
                  </Popover>
                ) : null}
                {!selected.required ? (
                  <Icon
                    className={cs.close}
                    icon="close"
                    onClick={() => onFieldRemove(selected)}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </Content>
      </Layout>
    );
  }
}
