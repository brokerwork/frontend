import { Button, Table, Input } from 'lean-ui';
import i18n from 'utils/i18n';
import ToggleInput from 'components/v2/ToggleInput';
import NumberInput from 'components/v2/NumberInput';
import cs from './index.less';

export default class SetScale extends Component {
  state = {
    showInput: false,
    batchScale: '' //批量保证金比例
  };
  toggle = toggle => {
    this.setState({
      showInput: toggle
    });
  };
  renderCell = ({ key, data, rowData, listData }) => {
    let content = '';
    switch (key) {
      case 'ratio':
        content = (
          <ToggleInput
            disabled={this.state.showInput}
            inputType="number"
            integer
            value={this.state[`${rowData.serverId}_${rowData.group}_scale`]}
            inputClassName={cs['deposit-input']}
            onInput={this.onChangeSingle.bind(
              this,
              rowData.serverId,
              rowData.group
            )}
          />
        );
        break;
      default:
        content = rowData[key];
    }
    return <Table.Td>{content}</Table.Td>;
  };
  columns = [
    {
      key: 'serverName',
      name: i18n['menu.twapp.vendor_setting.server_name']
    },
    {
      key: 'group',
      name: i18n['account.advanced_search.field.group']
    },
    {
      key: 'ratio',
      name: `${i18n['account.default_column.marginLevel']}（%）`
    }
  ];
  onChangeBatch = value => {
    this.setState({
      batchScale: value > 100 ? 100 : value
    });
  };
  onChangeSingle = (id, group, value) => {
    this.setState({
      [`${id}_${group}_scale`]: value > 100 ? 100 : value
    });
  };
  onClickSetBatch = () => {
    const { data } = this.props;
    data.forEach(el => {
      this.setState({
        [`${el.serverId}_${el.group}_scale`]: this.state.batchScale
      });
    });
    this.setState({
      showInput: false
    });
  };
  componentDidMount() {
    if (!this.props.initialValues) {
      return;
    }
    let groupData = this.props.initialValues.groupRatio || [];
    groupData.forEach(el => {
      this.setState({
        [`${el.serverId}_${el.group}_scale`]: el.ratio
      });
    });
  }
  render() {
    const { showInput, batchScale } = this.state;
    const { data } = this.props;
    return (
      <div>
        <div className={cs['set-header']}>
          <Button
            type="primary"
            className={cs['set-btn']}
            onClick={this.toggle.bind(this, true)}
          >
            {i18n['settings.notify_center.setScale_batch']}
          </Button>
          {showInput && (
            <div>
              <NumberInput
                value={batchScale}
                className={cs['input_long']}
                integer
                onChange={this.onChangeBatch}
                suffix="%"
              />
              <Button type="primary" onClick={this.onClickSetBatch}>
                {i18n['general.date_range_picker.lang.ok']}
              </Button>
            </div>
          )}
        </div>

        <Table
          className={cs['table']}
          fixedHeader
          columns={this.columns}
          data={data}
          renderCell={this.renderCell}
        />
      </div>
    );
  }
}
