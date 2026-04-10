import ContentWrapper from 'components/ContentWrapper';
import Button from 'components/Button';
import Select from 'components/Select';
import Modal from 'components/Modal';
import SearchList from 'landings/Home/path/Trader/components/OpenAccount/RealAccountSetting/SearchList';
import i18n from 'utils/i18n';
import List from './list';
import cs from './index.less';
const COLUMNS = [
  { key: 'sort' },
  { key: 'fieldName' },
  { key: 'required' },
  { key: 'fieldProperty' },
  { key: 'status' },
  { key: 'operation' }
];
export default class Root extends PureComponent {
  componentDidMount() {
    this.props.getPlats().then(rs => {
      if (rs.result) {
        this.props.getFieldList(rs.data[0]);
        this.setState({ value: rs.data[0] });
      }
    });
  }
  selectKeys = new Set();
  state = {
    isVisible: false,
    value: ''
  };
  onChangeSelect = keys => {
    this.selectKeys = keys;
  };
  onSelectFields = () => {
    this.props.chooseFields(this.selectKeys);
    this.setState({
      isVisible: false
    });
  };
  chooseFields = () => {
    this.setState({
      isVisible: true
    });
  };
  onClose = () => {
    this.setState({
      isVisible: false
    });
  };
  selectPlat = plat => {
    this.props.getFieldList(plat);
    this.setState({ value: plat });
  };
  onSortAccount = accountTypeInfos => {};
  openEdit = index => {};
  save = () => {
    this.props.saveFields(this.props.fieldList.accountFields, this.state.value).then(rs => {
      if (rs.result) {
        this.props.showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  };
  switchStatus = (status, plat) => {
    this.props.switchStatus(status, plat).then(rs => {
      if (rs.result) {
        this.props.showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  };
  render() {
    const { showTipsModal, showTopAlert, fieldList, switchStatus, plats } = this.props;
    const { isVisible, value } = this.state;
    return (
      <ContentWrapper bodyContentClass={cs.content_height} header={i18n['left.menu.form.setting']}>
        <div>
          <Button
            style={fieldList.functionEnable ? 'default' : 'primary'}
            onClick={this.switchStatus.bind(null, !fieldList.functionEnable, value)}
          >
            {!fieldList.functionEnable ? i18n['general.enable'] : i18n['general.close']}
          </Button>
        </div>
        <div className={cs.add}>
          {i18n['trader.form.registerform']}
          <i
            title={i18n['field.setting.field.title.editField']}
            className="fa fa-cog fa-gear"
            onClick={this.chooseFields}
          />
          {i18n['trader.form.plat']}
          <Select
            value={value}
            className={cs.select}
            options={plats.map(el => ({ value: el, label: el }))}
            onChange={this.selectPlat}
          />
        </div>
        <List
          columns={COLUMNS}
          data={fieldList.accountFields}
          openEdit={this.openEdit}
          onSort={this.props.sort}
          onDel={this.props.del}
        />
        <Button className={cs.btn} style={'primary'} onClick={this.save}>
          {i18n['general.save']}
        </Button>
        <Button style={'default'} onClick={() => {}}>
          {i18n['trader.account.profile.setting.reset']}
        </Button>
        {isVisible && (
          <Modal onClose={this.onClose}>
            <Modal.Header>{i18n['field.setting.field.selectTips']}</Modal.Header>
            <Modal.Body>
              <SearchList listData={fieldList.poolFields} onChangeSelect={this.onChangeSelect} />
            </Modal.Body>
            <Modal.Footer>
              <Button style="primary" onClick={this.onSelectFields}>
                {i18n['general.apply']}
              </Button>
              <Button onClick={this.onClose}>{i18n['app.btn.cancel']}</Button>
            </Modal.Footer>
          </Modal>
        )}
      </ContentWrapper>
    );
  }
}
