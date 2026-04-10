// libs
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, LoadingMask, Panel, Message, Modal, Card, TableColumnOpt, Pagination, SearchBox, NewSelect } from 'fooui';
// ui
import FilterTools from '../components/filterTools';
import BatchTools from '../components/batchTools';
import { DataGrid } from '../../customermgmt/components/datagird';
import EditAccountCard from '../components/editAccountCard';
import { DeleteConfirm } from '../../customermgmt/components/deleteConfirm';
import { utils } from '../../common/utils';
// model
import {
  AccountDTO as Account, ExternalInfo
} from '../model/account';
// action
import {
  selectAllAccount,
  selectAccount,
  editAccount,
  fetchAccount,
  changePageSize,
  updateEnable,
  updateReadonly,
  setFuzzyField,
  setFuzzyType,
  setFuzzySearch,
  selectSever,
} from '../actions/accountTableActions';
import {initAddAccountCard} from '../actions/addAccountActions';
import {
  initEditAccountCard, updateBaseInfo, getAccountFields, getBasicFields,
  getPhoneCountryCode, getCertificatesFields, getFinanceFields
} from '../actions/editAccountActions';
import { IAccountState, mt4Store } from '../store/mt4store';
import VenderHelper from '../utils/venderHelper';
import ServerHelper from '../utils/serverHelper';

/* ------------------- main start ---------------------- */
let getValue = utils.getValue;
let linkStyle = {
  color: '#428bca'
}

let serverId = ServerHelper.getServer();

let enableIconStyle = {
  backgroundColor: '#1fb5ad',
  color: '#fff',
  width: '24px',
  height: '24px',
  borderRadius: '3px',
  lineHeight: '24px'
}

let disableIconStyle = {
  backgroundColor: '#c7cbd6',
  color: '#fff',
  width: '24px',
  height: '24px',
  borderRadius: '3px',
  lineHeight: '24px'
}

let accountTableColOpts: Array<TableColumnOpt> = [
  {
    title: '账户归属',
    dataIndex: 'userName',
    key: 'userName',
    width: '6%',
    renderer: function (value, rowData: Account) {
      var userName = getValue(rowData, 'userName');
      return userName
    }
  }, {
    title: '账号',
    dataIndex: 'login',
    key: 'login',
    width: '6%'
  }, {
    title: '姓名',
    dataIndex: 'accountName',
    key: 'accountName',
    width: '6%'
  }, {
    title: 'MT4组',
    dataIndex: 'group',
    key: 'group',
    width: '6%'
  }, {
    title: '账户余额',
    dataIndex: 'balance',
    key: 'balance',
    width: '6%'
  }, {
    title: '浮动盈亏',
    dataIndex: 'profit',
    key: 'profit',
    width: '6%'
  }, {
    title: '账户净值',
    dataIndex: 'equity',
    key: 'equity',
    width: '6%'
  }, {
    title: '杠杆',
    dataIndex: 'leverage',
    key: 'leverage',
    width: '6%'
  }, {
    title: '账户创建时间',
    dataIndex: 'regdate',
    key: 'regdate',
    width: '6%',
    renderer(v) {
      return v ? moment(v).format('YYYY-MM-DD HH:mm:ss') : 'N/A'
    }
  }, {
    title: '交易状态',
    dataIndex: 'readOnly',
    key: 'readOnly',
    width: '6%',
    renderer(v, acct) {
      let style = v === 1 ? enableIconStyle : disableIconStyle;
      return <i className="fa fa-check-circle touchhand" style={style} onClick={() => {
        mt4Store.dispatch(updateReadonly(acct.login, v === 1 ? 0 : 1))
      } }></i>
    }
  }, {
    title: '登录状态',
    dataIndex: 'enable',
    key: 'enable',
    width: '6%',
    renderer(v, acct) {
      let style = v === 1 ? enableIconStyle : disableIconStyle;
      return <i className="fa fa-check-circle touchhand" style={style} onClick={() => {
        mt4Store.dispatch(updateEnable(acct.login, v === 1 ? 0 : 1))
      } }></i>
    }
  }

]

interface P {
  dispatch?: Function,
  accountList?: Array<Account>,
  total?: number,
  currentPageNo?: number,
  pageSize?: number,
  totalPageNo?: number,
  selectSever?: Function
}
class Mt4Acct extends React.Component<P, {}> {
  refs: any;
  constructor(props: P) {
    super(props);
  }

  componentDidMount() {
    VenderHelper.setVender(VenderHelper.MT4);
    LoadingMask.unmaskAll();
    if (serverId === undefined) {
      let refContentCreator = function () {
        return <div className="confirmModal">
          请先确保选择服务器
                    </div>
      };
      var m = Modal.show({
        title: '选择服务器确认',
        hasOk: true,
        onOk: () => {
          m.close();
        },
        refContentCreator: refContentCreator
      })
    } else {
      this.props.dispatch(fetchAccount());
    }
    this.props.dispatch(selectSever());
		this.props.dispatch(getBasicFields());
		this.props.dispatch(getAccountFields());
		this.props.dispatch(getCertificatesFields());
		this.props.dispatch(getFinanceFields());
		this.props.dispatch(getPhoneCountryCode());
  }

  selectAllAccount = (idsOrId: any, checked: boolean) => {
    this.props.dispatch(selectAllAccount(checked))
  }

  selectAccount = (id: string, checked: boolean) => {
    this.props.dispatch(selectAccount(id, checked))
  }

  currentPageNoChangeHandler = (no: number) => {
    this.props.dispatch(fetchAccount(no))
  }

  pageSizeChangeHandler = (pageSize: number) => {
    this.props.dispatch(changePageSize(pageSize))
    this.props.dispatch(fetchAccount(1))
  }

  fuzzySearch = () => {
    let fuzzyType = this.refs.fuzzyItem.getCurrentItemValue();
    let fuzzyField = this.refs.fuzySearch.getValue();
    setFuzzyType(fuzzyType);
    setFuzzyField(fuzzyField);
    setFuzzySearch(true);
    this.props.dispatch(fetchAccount(1))
  }

  render() {
    let self = this;
    accountTableColOpts[1].renderer = function (v: string, accountData: Account, rowIndex: number, cmpt: any) {
      return <a style={linkStyle} href="javascript:void(0)" className="edit-card" onClick={() => {
        self.props.dispatch(initEditAccountCard())
        self.refs.filterTools.getWrappedInstance().hideAddAccountCard()
        self.props.dispatch(editAccount(accountData.login))
      } }>{v}</a>
    }
    return (
      <div>
        <div className="acct-main page-wrapper">
          <Row>
            <Col md={12}>
              <Panel title="MT4账户管理">
                <div className="toolbar">
                  <FilterTools ref="filterTools" />
                  <BatchTools />
                  {/* fuzzy search */}
                  <div className="pull-right">
                    <div className="search-group">
                      <NewSelect options={[
                        { label: '姓名', value: 'accountName' },
                        { label: '账号', value: 'account' },
                        { label: '账户归属', value: 'userName' }]}
                        iconRight={"fa fa-angle-down"}
                        isChangeText={true}
                        btnText="姓名"
                        className="ghost-btn menu-btn newselect-menu"
                        ref="fuzzyItem"
                        />
                      <SearchBox
                        ref="fuzySearch"
                        width={300}
                        onEnter={this.fuzzySearch}
                        />
                    </div>
                  </div>
                </div>
                {/* ------ data table begin ----- */}
                <div className="row">
                  <div className="col-md-12">
                    <DataGrid
                      idKey={function (data: Account) {
                        return data.login
                      } }
                      columnOpts={accountTableColOpts}
                      datas={this.props.accountList}
                      toggleAllItems={this.selectAllAccount}
                      toggleItem={this.selectAccount}
                      />
                  </div>
                </div>
                {/* ------ data table end ------ */}
                {/* ------ pagination begin ------ */}
                <div className="row">
                  <div className="col col-md-2">
                    <p className="pages-color">
                      共&nbsp;<span className="number-color">{this.props.total}</span>&nbsp;条, 当前第&nbsp;<span className="number-color">{this.props.currentPageNo}</span>&nbsp;页
                      </p>
                  </div>
                  <div className="col col-md-10 pull-right pages-color">
                    <Pagination ref="pg"
                      total={this.props.totalPageNo}
                      current={this.props.currentPageNo}
                      pageSize={this.props.pageSize}
                      pageSizeOptions={[10, 20, 30]}
                      onChange={this.currentPageNoChangeHandler}
                      onPageSizeChange={this.pageSizeChangeHandler}
                      />
                  </div>
                </div>
                {/* ----- pagination end ----- */}
              </Panel>
            </Col>
          </Row>
        </div>
        <EditAccountCard />
      </div>
    );
  }
}

function mapStateToProps(state: IAccountState) {
  return {
    accountList: state.accountTable.accountList,
    total: state.accountTable.total,
    currentPageNo: state.accountTable.currentPageNo,
    pageSize: state.accountTable.pageSize,
    totalPageNo: state.accountTable.totalPageNo
  }
}

export default connect<P, any, any>(mapStateToProps)(Mt4Acct);
