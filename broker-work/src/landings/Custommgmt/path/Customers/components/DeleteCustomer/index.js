import i18n from 'utils/i18n';
import DryRunResult from './components/DryRunResult';
import cs from './deleteCustomer.less';
import DropDown from 'components/Dropdown';
import { PureComponent } from 'react';
import { Input, Radio } from 'lean-ui';
import { DELETE_REASONS } from '../../constant';
class DeleteForm extends PureComponent {
  state = {
    reasonKey: undefined,
    resonText: ''
  };
  onReasonSelect = selected => {
    const { onChange } = this.props;
    const { resonText } = this.state;
    this.setState({ reasonKey: selected });
    const result = selected === null ? resonText : selected;
    onChange(result);
  };
  onReasonInput = evt => {
    const { onChange } = this.props;
    const text = evt.target.value;
    this.setState({ reasonText: text });
    onChange(text);
  };
  render() {
    const { reasonKey, reasonText } = this.state;
    return (
      <div>
        <div className={cs['note']}>{i18n['customer.trash.modal.tip']}</div>
        <div className={cs['reason']}>
          {DELETE_REASONS.map(item => {
            return (
              <Radio
                className={cs['row']}
                key={item.value}
                name={'deleteReason'}
                onChange={this.onReasonSelect.bind(this, item.value)}
                checked={reasonKey === item.value}
              >
                {item.label}
              </Radio>
            );
          })}
          <Radio
            className={cs['row']}
            name={'deleteReason'}
            onChange={this.onReasonSelect.bind(this, null)}
            checked={reasonKey === null}
          >
            {i18n['customer.trash.delete_reason.other']}
          </Radio>
        </div>
        <div className={cs['input']}>
          {reasonKey === null ? (
            <Input
              value={reasonText}
              onChange={this.onReasonInput}
              placeholder={i18n['customer.trash.placeholder']}
            />
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }
}
export default class Delete extends PureComponent {
  state = {
    reason: undefined
  };

  batchDeleteCustomers = cb => {
    const {
      deleteCustomers,
      selectedItemsMap,
      showTopAlert,
      backToRoot
    } = this.props;
    const { reason } = this.state;
    let customerids = Object.keys(selectedItemsMap);
    deleteCustomers(customerids, reason).then(res => {
      if (!res.result) return;
      showTopAlert({
        content: i18n['general.remove_success'],
        bsStyle: 'success'
      });
      backToRoot(true, true);
    });
  };

  batchDeleteCustomersDryRun = () => {
    const { deleteCustomersDryRun, selectedItemsMap } = this.props;
    let customerids = Object.keys(selectedItemsMap);
    return deleteCustomersDryRun(customerids, selectedItemsMap).then(res => {
      if (res.result) {
        const dryRunResult = res.data;
        return Promise.resolve(dryRunResult);
      } else {
        return Promise.reject('dry run delete customers fail');
      }
    });
  };

  onDeleteConfirm = cb => {
    const { showTipsModal, backToRoot } = this.props;
    this.batchDeleteCustomersDryRun().then(dryRunResult => {
      if (
        dryRunResult.bindAccount.length === 0 &&
        dryRunResult.bindTa.length === 0
      ) {
        cb();
        this.batchDeleteCustomers(cb);
        backToRoot();
      } else {
        showTipsModal({
          content: <DryRunResult {...this.props} dryRunResult={dryRunResult} />,
          onConfirm: cb => {
            cb();
            this.batchDeleteCustomers(cb);
            backToRoot();
          },
          onCancel: cb => {
            cb();
            backToRoot();
          },
          noConfirm: !dryRunResult.canRemove
        });
      }
    });
  };
  onChange = selected => {
    this.setState({
      reason: selected
    });
  };
  componentDidMount() {
    const { showTipsModal, backToRoot, selectedItemsMap } = this.props;
    if (!Object.keys(selectedItemsMap).length) {
      backToRoot();
      return;
    }
    showTipsModal({
      header: i18n['customer.trash.modal.title'],
      content: <DeleteForm onChange={this.onChange} />,
      onCancel: cb => {
        cb();
        backToRoot();
      },
      onConfirm: cb => {
        this.onDeleteConfirm(cb);
      }
    });
  }
  render() {
    return <div />;
  }
}
