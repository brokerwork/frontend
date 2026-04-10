import Modal from 'components/Modal';
import Button from 'components/Button';
import Radio from 'components/Radio';
import Checkbox from 'components/Checkbox';
import i18n from 'utils/i18n';
import cs from './index.less';

export default class AccountGroups extends PureComponent {
  constructor(props) {
    super(props);
    const isAll = this.props.chooseGroups.length === 0 ? 'all' : 'notAll';
    let chosenKeys = {};
    this.props.chooseGroups.forEach(el => {
      chosenKeys[el.key] = true;
    });
    const accountGroups = this.props.accountGroups.map(el => {
      el.checked = chosenKeys[el.id] ? true : false;
      return el;
    });
    this.state = {
      radio: isAll,
      chooseAll: this.props.chooseGroups.length === this.props.accountGroups.length,
      accountGroups
    };
  }
  onSave = () => {
    const { saveConfig, showTopAlert } = this.props;
    let data = this.state.accountGroups.filter(el => !!el.checked);
    if (this.state.radio !== 'all' && !data.length) {
      showTopAlert({
        content: i18n['trader.plat.setting.deposit.plat.range.error']
      });
      return false;
    }
    saveConfig(this.state.radio === 'all' ? [] : data);
  };
  changeRange = value => {
    this.setState({
      radio: value
    });
  };
  onClose = () => {
    this.props.onClose();
  };
  onAllChange = () => {
    this.setState(
      {
        chooseAll: !this.state.chooseAll
      },
      () => {
        let { accountGroups } = this.state;
        accountGroups = _.cloneDeep(accountGroups);
        accountGroups.forEach(el => {
          el.checked = this.state.chooseAll;
        });
        this.setState({
          accountGroups
        });
      }
    );
  };
  onAccountChange = value => {
    let { accountGroups } = this.state;
    accountGroups = _.cloneDeep(accountGroups);
    accountGroups.forEach(el => {
      if (el.id === value) {
        el.checked = !el.checked;
      }
    });
    this.setState(
      {
        accountGroups
      },
      () => {
        this.setState({
          chooseAll: this.state.accountGroups.every(el => !!el.checked)
        });
      }
    );
  };
  renderForm = () => {
    const { isWithdraw } = this.props;
    let content = (
      <div>
        <Radio className={cs.label} onChange={this.changeRange.bind(this, 'all')} checked={this.state.radio === 'all'}>
          {i18n['trader.plat.setting.deposit.plat.range.all']}
        </Radio>
        {this.state.radio === 'all' &&
          (isWithdraw
            ? i18n['trader.plat.setting.deposit.plat.range.allTip_withdraw']
            : i18n['trader.plat.setting.deposit.plat.range.allTip'])}
        <Radio
          className={cs.label}
          onChange={this.changeRange.bind(this, 'notAll')}
          checked={this.state.radio === 'notAll'}
        >
          {i18n['trader.plat.setting.deposit.plat.range.accounts']}
        </Radio>
        {this.state.radio === 'notAll' && [
          <Checkbox className={cs.label} key={'all'} onChange={this.onAllChange} checked={this.state.chooseAll}>
            {i18n['trader.plat.setting.deposit.plat.range.chooseAll']}
          </Checkbox>,
          this.state.accountGroups.map(el => {
            return (
              <Checkbox
                className={cs.label}
                key={el.id}
                checked={el.checked}
                onChange={this.onAccountChange.bind(this, el.id)}
              >
                {el.groupName}
              </Checkbox>
            );
          })
        ]}
      </div>
    );
    let noGroupsContent = (
      <div>
        <p>{i18n['trader.plat.setting.deposit.plat.range.tip1']}</p>
        <p>
          {i18n['trader.plat.setting.deposit.plat.range.tip2']}
          <i style={{ color: '#1fb5ad', margin: '0 5px' }}>{i18n['trader.plat.setting.deposit.plat.range.target']}</i>
          {i18n['trader.plat.setting.deposit.plat.range.tip3']}
        </p>
      </div>
    );
    return !!this.state.accountGroups.length ? content : noGroupsContent;
  };
  render() {
    const { isWithdraw } = this.props;
    return (
      <Modal onClose={this.onClose}>
        <Modal.Header>
          {isWithdraw
            ? i18n['trader.plat.setting.deposit.plat.range_withdraw']
            : i18n['trader.plat.setting.deposit.plat.range']}
        </Modal.Header>
        <Modal.Body>{this.renderForm()}</Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={this.onClose}> {i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
