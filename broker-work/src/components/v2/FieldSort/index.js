import i18n from 'utils/i18n';
import { Dialog, Transfer } from 'lean-ui';
/**
 * 传入参数：data(全部字段,每个字段带有标记是否显示，根据这个标记在一开始会整理数据),
 * 需注意传入的data里单个item必须具有{label, key, show}字段
 */

export default class FieldSort extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
      selectedKeys: []
    };
  }
  componentDidMount() {
    this.classifyData();
  }

  classifyData = () => {
    const { data } = this.props;
    const targetKeys = [];
    data.forEach(item => {
      if (item.show) {
        targetKeys.push(item.key);
      }
    });
    this.setState({
      targetKeys
    });
  };

  onSubmit = () => {
    const { targetKeys } = this.state;
    const { onSubmit, data } = this.props;
    const result = data
      .map(item => {
        return {
          key: item.key,
          label: item.label,
          show: targetKeys.includes(item.key)
        };
      })
      .sort((a, b) => {
        let aIndex = targetKeys.indexOf(a.key);
        let bIndex = targetKeys.indexOf(b.key);
        aIndex = aIndex === -1 ? targetKeys.length : aIndex;
        bIndex = bIndex === -1 ? targetKeys.length : bIndex;
        return aIndex - bIndex;
      });
    onSubmit(result);
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({
      selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
    });
  };

  render() {
    const { title, onHide, data } = this.props;
    const { targetKeys, selectedKeys } = this.state;
    return (
      <Dialog
        title={title}
        visible={true}
        onCancel={onHide}
        onOk={this.onSubmit}
        okText={i18n['general.save']}
        cancelText={i18n['general.cancel']}
      >
        <Transfer
          dataSource={data}
          titles={[i18n['sort.hide_field'], i18n['sort.show_field']]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          render={item => item.label}
          transferLocale={{
            notFoundContent: i18n['transfer.not_found_content'],
            searchPlaceholder: i18n['transfer.search_placeholder'],
            itemUnit: i18n['transfer.item_unit'],
            itemsUnit: i18n['transfer.item_unit']
          }}
        />
      </Dialog>
    );
  }
}
