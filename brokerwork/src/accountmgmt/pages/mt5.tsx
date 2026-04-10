// libs
import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Panel, Modal, Card, TableColumnOpt, Pagination, SearchBox,NewSelect } from 'fooui';
// ui
import FilterTools from '../components/filterTools';
import BatchTools from '../components/batchTools';
import { DataGrid } from '../../customermgmt/components/datagird';
import EditAccountCard from '../components/editAccountCard';
// model
import {
    AccountDTO as Account, ExternalInfo} from '../model/account';
// action
import { selectAllAccount, selectAccount, editAccount, fetchAccount } from '../actions/accountTableActions';
// 
import { IAccountState, mt4Store } from '../store/mt4store';
import VenderHelper from '../utils/venderHelper';

/* ------------------- main start ---------------------- */
let linkStyle = {
  color:'#428bca'
}
let accountTableColOpts:Array<TableColumnOpt> = [
  {
    title: '账户归属',
    dataIndex: 'userName',
    key: 'userName',
    width: '6%'
  },{
    title: '账号',
    dataIndex: 'login',
    key: 'login',
    width: '6%'
  },{
    title: '姓名',
    dataIndex: 'familyName',
    key: 'familyName',
    width: '6%'
  },{
    title: 'MT4组',
    dataIndex: 'group',
    key: 'group',
    width: '6%'
  },{
    title: '账户余额',
    dataIndex: 'balance',
    key: 'balance',
    width: '6%'
  },{
    title: '浮动盈亏',
    dataIndex: 'profit',
    key: 'profit',
    width: '6%'
  },{
    title: '账户净值',
    dataIndex: 'equity',
    key: 'equity',
    width: '6%'
  },{
    title: '杠杆',
    dataIndex: 'leverage',
    key: 'leverage',
    width: '6%'
  },{
    title: '账户创建时间',
    dataIndex: 'regdate',
    key: 'regdate',
    width: '6%',
    renderer( v ) {
      return v ? moment(v).format( 'YYYY-MM-DD HH:mm:ss' ) : 'N/A'
    }
  }, {
    title: '交易状态',
    dataIndex: 'enableReadonly',
    key: 'enableReadonly',
    width: '6%',
    renderer( v ){
      return v+''
    }
  }, {
    title: '登录状态',
    dataIndex: 'enable',
    key: 'enable',
    width: '6%',
    renderer( v ){
      return v+''
    }
  }

]

interface P {
  dispatch?:Function,
  accountList?: Array<Account>,
  queryContent?: string
}
class Mt5Acct extends React.Component<P,{}> {
  refs: any;
  constructor( props:P ) {
    super( props );
  }

  componentDidMount() {
    VenderHelper.setVender( VenderHelper.MT5 );
    this.props.dispatch( fetchAccount() )
  }

  selectAllAccount = ( idsOrId:any, checked:boolean )=>{
    this.props.dispatch( selectAllAccount(checked) )
  }

  selectAccount = ( id:string, checked:boolean )=> {
    this.props.dispatch( selectAccount( id, checked ) )
  }
  
  render() {
    let self = this;
    accountTableColOpts[1].renderer = function(v:string, accountData:Account, rowIndex:number, cmpt:any ) {
      return <a style={linkStyle} className="edit-card" href="javascript:void(0)" onClick={ ()=>{
                                              self.refs.filterTools.getWrappedInstance().hideAddAccountCard()
                                              self.props.dispatch( editAccount(accountData.id))
                                            } }>{v}</a>
    }
    return (
      <div>
        <div className="acct-main page-wrapper">
          <Row>
            <Col md={12}>
              <Panel title="MT5账户管理">
                  <div className="toolbar">
                    <FilterTools ref="filterTools"/>
                    <BatchTools/>
                    {/* fuzzy search */}
                    <div className="pull-right">
                      <div className="search-group">
                        <NewSelect options={[
                          { label: '客户名称', value: 'CustomerName' },
                          { label: '客户ID', value: 'CustomerId' },
                          { label: '姓名', value: 'ContactName' },
                          { label: '电话', value: 'ContactPhone' },
                          { label: '邮箱', value: 'ContactMail' }
                                                                ]}
                                   iconRight={"fa fa-angle-down"}
                                   isChangeText={true}
                                   btnText="客户名称"
                                   className="ghost-btn menu-btn newselect-menu"
                                   ref="fuzzyItem"
                        />
                        <SearchBox
                            ref="fuzySearch"
                            width={300}
                            value={ this.props.queryContent }
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
                        columnOpts={ accountTableColOpts }
                        datas={ this.props.accountList }
                        toggleAllItems={ this.selectAllAccount }
                        toggleItem={ this.selectAccount }
                      />
                    </div>
                  </div>
                  {/* ------ data table end ------ */}
                  {/* ------ pagination begin ------ */}
                  <div className="row">
                    <div className="col col-md-2">
                      <p className="pages-color">
                        共&nbsp;<span className="number-color">{'0'}</span>&nbsp;条, 当前第&nbsp;<span className="number-color">{0}</span>&nbsp;页
                      </p>
                    </div>
                    <div className="col col-md-10 pull-right pages-color">
                      <Pagination ref="pg"
                        total={1}
                        current={1}
                        pageSize={10}
                        pageSizeOptions={[10, 20, 30]}
                      />
                    </div>
                  </div>
                  {/* ----- pagination end ----- */}
              </Panel>
            </Col>
          </Row>
        </div>
        <EditAccountCard/>
      </div>
    );
  }
}

function mapStateToProps( state:IAccountState ) {
  return {
    accountList: state.accountTable.accountList,
    queryContent: state.accountTable.queryContent
  }
}

export default connect<P,any,any>( mapStateToProps )(Mt5Acct);
