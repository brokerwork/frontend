import DropdownForCode from 'components/v2/DropdownForCode';
import AddModal from '../AddModal';
import i18n from 'utils/i18n';
import cs from './ActionsBar.less';
import { Button, Input } from 'lean-ui';

const typeArr = [
  { label: i18n['runmgmt.source_setting.type.0'], value: '0' },
  { label: i18n['runmgmt.source_setting.type.1'], value: '1' },
  { label: i18n['runmgmt.source_setting.type.2'], value: '2' }
];
const stateArr = [
  { label: i18n['runmgmt.source_setting.state.0'], value: '0' },
  { label: i18n['runmgmt.source_setting.state.2'], value: '2' },
  { label: i18n['runmgmt.source_setting.state.3'], value: '3' }
];

export default class SourceSettingActionBar extends PureComponent {
  state = {
    inputText: '',
    addShow: false
  };
  componentDidMount() {
    const { userRights } = this.props;
    if (!userRights['OPERATION_COPY_PLATFORM']) {
      this.modify('type', 1);
    }
  }
  onInputChange(e) {
    this.setState({
      inputText: e.target.value
    });
  }
  onInputKeyDown(e) {
    if (e.keyCode === 13) {
      this.modify('tradeName', e.target.value);
    }
  }
  modify(key, val) {
    const { searchParams, modifySearchParams } = this.props;
    modifySearchParams({
      ...searchParams,
      currPage: 1,
      [key]: val
    });
  }
  addClick() {
    this.setState({
      addShow: true
    });
  }
  onHide() {
    this.setState({
      addShow: false
    });
  }
  onFormSubmit() {
    this.setState({
      addShow: false
    });
  }
  render() {
    const {
      searchParams,
      submitForm,
      addSource,
      showTipsModal,
      getList,
      getServerList,
      resetForm,
      userRights
    } = this.props;
    const { inputText, addShow } = this.state;
    const typeRight = userRights['OPERATION_COPY_PLATFORM'];
    return (
      <div className={cs['action-bar']} data-test="action-bar">
        <div className={cs['action-left']}>
          <Button type="primary" onClick={this.addClick.bind(this)}>
            <span className="fa fa-plus" />
            {i18n['runmgmt.source_setting.add']}
          </Button>
          <span
            className={`${cs['source-type']} ${typeRight ? '' : cs['hidden']}`}
          >
            <DropdownForCode
              onChange={val => this.modify('type', val)}
              value={searchParams.type}
              data={typeArr}
            />
          </span>
          <span className={cs['source-state']}>
            <DropdownForCode
              data={stateArr}
              value={searchParams.state}
              onChange={val => this.modify('state', val)}
            />
          </span>
        </div>
        <span />
        <div className={cs['search-bar']}>
          <Input
            className="form-control"
            type="text"
            value={inputText}
            onChange={this.onInputChange.bind(this)}
            onKeyDown={this.onInputKeyDown.bind(this)}
            placeholder={i18n['runmgmt.source_setting.search']}
          />
        </div>
        {addShow ? (
          <AddModal
            onHide={this.onHide.bind(this)}
            submitForm={submitForm}
            resetForm={resetForm}
            addSource={addSource}
            getList={getList}
            getServerList={getServerList}
            showTipsModal={showTipsModal}
            searchParams={searchParams}
            onFormSubmit={this.onFormSubmit.bind(this)}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
