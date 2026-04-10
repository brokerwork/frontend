import i18n from 'utils/i18n';
import ColumnSelector from 'components/ColumnSelector';
import { Dialog, Button } from 'lean-ui';

import cs from './SubDetailModal.less';

export default class SubDetailModal extends PureComponent {
  constructor(props) {
    super(props);
    const { initialData, defaultValue } = this.props;
    const columnData = initialData ? [initialData] : [];
    this.state = {
      columnData,
      parentValue: defaultValue,
      currentValue: defaultValue,
      isDirect: false
    };
  }

  componentDidMount() {
    const { currentValue, columnData } = this.state;
    this.getData(currentValue, columnData);
  }

  getData = (selected = {}, data) => {
    const { getData } = this.props;
    getData(selected.value || selected.id).then(res => {
      const __data = data.concat();
      if (!res.result) return Promise.resolve(res);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const __d = res.data.concat();
        __data.push(__d);
      }
      this.setState({
        columnData: __data,
        parentValue: selected,
        currentValue: selected
      });
    });
  };

  onSelect = (selected, data) => {
    if (selected.child) {
      return this.getData(selected, data);
    }

    this.setState({
      columnData: data.concat(),
      currentValue: selected
    });
  };

  render() {
    const { columnData } = this.state;
    const { defaultValue, show, onHide } = this.props;
    return (
      <Dialog
        visible={show}
        onCancel={onHide}
        width={700}
        title={i18n['settings.role_setting.sub_detail_Header']}
        footer={
          <div>
            <Button type="default" onClick={onHide}>
              {i18n['general.cancel']}
            </Button>
          </div>
        }
      >
        <ColumnSelector
          className={cs['selector']}
          onChange={this.onSelect}
          defaultValue={defaultValue ? { 0: defaultValue.value } : undefined}
          data={columnData}
        />
      </Dialog>
    );
  }
}
