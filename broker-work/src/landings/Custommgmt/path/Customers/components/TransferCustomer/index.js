import i18n from 'utils/i18n';
import UserSelect from 'components/v2/UserSelector';
import cs from './transferCustomer.less';
import { Checkbox } from 'lean-ui';

class TransferForm extends Component {
  state = {
    selected: null,
    shiftContacts: false,
    shiftOpportunity: false
  };
  onCheck = (key, checkStatus) => {
    const { onChange } = this.props;
    const state = {
      [key]: !checkStatus
    };
    this.setState(state);
    onChange(key, !checkStatus);
  };
  onSelect = selected => {
    const { onChange } = this.props;
    this.setState({ selected });
    onChange('selected', selected);
  };
  render() {
    const { shiftContacts, shiftOpportunity } = this.state;
    return (
      <div>
        <p>{i18n['customer.transfer_tips']}</p>
        <div>
          <UserSelect
            className={cs['dropdown']}
            withRight
            autoWidth
            defaultSelect
            onSelect={this.onSelect}
          />
          <div className={cs['shift']}>
            <span className={cs['item']}>
              <Checkbox
                checked={shiftContacts}
                onChange={this.onCheck.bind(
                  this,
                  'shiftContacts',
                  shiftContacts
                )}
              >
                {i18n['customer.transfer.shiftContacts']}
              </Checkbox>
            </span>
            <span className={cs['item']}>
              <Checkbox
                checked={shiftOpportunity}
                onChange={this.onCheck.bind(
                  this,
                  'shiftOpportunity',
                  shiftOpportunity
                )}
              >
                {i18n['customer.transfer.shiftOpportunity']}
              </Checkbox>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default class Transfer extends PureComponent {
  __state = {
    selected: null,
    shiftContacts: false,
    shiftOpportunity: false
  };
  onChange = (key, value) => {
    this.__state[key] = value;
  };
  componentDidMount() {
    const { showTipsModal, backToRoot, selectedItemsMap } = this.props;
    if (!Object.keys(selectedItemsMap).length) {
      backToRoot();
      return;
    }
    showTipsModal({
      header: i18n['customer.transfer_customer'],
      content: <TransferForm onChange={this.onChange.bind(this)} />,
      onCancel: cb => {
        cb();
        backToRoot();
      },
      onConfirm: cb => {
        this.onSubmit(cb);
      }
    });
  }
  onSubmit = cb => {
    const {
      divideCustomers,
      selectedItemsMap,
      backToRoot,
      showTopAlert
    } = this.props;
    const { selected = {}, shiftContacts, shiftOpportunity } = this.__state;
    const customerids = Object.keys(selectedItemsMap);
    const oweId = selected ? selected.value : undefined;
    if (!oweId) {
      showTopAlert({
        content: i18n['customer.transfer.warnning'],
        bsStyle: 'danger'
      });
      return;
    }
    Promise.resolve(
      divideCustomers({
        ids: customerids,
        oweId,
        shiftContacts,
        shiftOpportunity
      })
    ).then(res => {
      cb();
      if (res.result) {
        showTopAlert({
          content: i18n['general.transfer_success'],
          bsStyle: 'success'
        });
        backToRoot(true);
      }
    });
  };
  render() {
    return <div data-test="transfer-customer" />;
  }
}
