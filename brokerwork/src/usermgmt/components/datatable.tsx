// libs
import * as React from 'react';
import { connect } from 'react-redux';
import { TableColumnOpt, Modal, TreeDiagram, Table, Message,Tree, LoadingMask } from 'fooui';
import {I18nLoader} from '../../i18n/loader';
import {UserHelper} from '../../common/userHelper';
import {HttpClient} from '../../http/httpclient';
import {userMgmtStore} from '../store/usermgmtstore'
import CountryCityHelper from '../../common/countryCityHelper';
// store
import { UserAppState } from '../store/usermgmtstore';
import { 
  fetchUserTableColumns, 
  fetchUser, 
  toggleUserSelect, 
  toggleAllUserSelect,
  showUserEditor,
  SelectRole,
  SelectLevelCount,
  changeShowAllChecked,
  ShowUpwardReturn,
	ShowReakRuleDetail,
  hideEditCard,
  changeOrderType,
  changeSortType
} from '../actions/useractions';
import {utils} from '../../common/utils';
import {BWUserDTO} from '../model/user';
import PrivilegeHelper from '../../common/privilegeHelper';
/* ------------------- main start ---------------------- */
let token = UserHelper.getToken();
let selectedCount;
let showAllChecked = false; 
let temPageSize;

interface P {
  colOptions?: Array<TableColumnOpt>,
  dataList?: Array<any>,
  toggleUserSelect?: Function,
  toggleAllUserSelect?: Function,
  fetchUser?:Function,
  showUserEditor?: Function,
  onIdClick?:Function,
  SelectLevelCount?:Function,
  showTree?: Function,
  selectedCount?: number,
  showAllChecked?: boolean,
  changeShowAllChecked?: Function,
  pageSize?: number,
  showUpwardReturn?:Function,
	showReakRuleDetail?:Function,
  hideEditCard?: Function,
  changeSortType?:Function,
  changeOrderType?: Function,
  sortType?: string,
  selectHierarchy?:Object,
  simpleUserList?: Object,
  SimpleRoleList?: Object
}

interface S {
  nameSort: boolean,
  createTimeSort: boolean,
  entityNoSort: boolean
}

let showEditorLinkStyle = {
  display: 'inline-block',
  padding: '0 5px',
  color:'#428bca'
}

class DataTable extends React.Component<P,S> {
  refs:any;
  constructor( props:P ) {
    super( props );
    this.state = {
      nameSort: false,
      createTimeSort: false,
      entityNoSort: false
    }
  }
  
  componentDidMount() {
    // this.props.initCol();
    // // this.props.dispatch()
    // this.props.fetchUser() // move fetchuser to selectRole
  }
  showTree = (id) => {
      let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
                LoadingMask.maskAll();
                HttpClient.doPost('/v1/user/' + id + '/listUserTreeById', {}, otherHeaders)
                    .then((res) => {
                        if (res.result){
                            LoadingMask.unmaskAll();
                            let refContentCreator = function(){
                                return   <div ref="contentshow">
                                              <TreeDiagram ref="tdgm" data={res.data} autoInitTree={true}/>
                                         </div>
                            }; 
                            var m = Modal.show({
                               title: '下级用户结构',
                               hasCancel: true,
                               onCancel: ()=>{},
                               refContentCreator: refContentCreator
                            })
                        }else{
                            Message.error( I18nLoader.getErrorText(res.mcode) );
                            LoadingMask.unmaskAll();
                        }
        })  
  }

  checkedAll = (e) => {
    if(this.props.showAllChecked){
        this.props.changeShowAllChecked(false);
        this.props.toggleAllUserSelect( e.target.checked );
    }else{
      this.props.changeShowAllChecked(true);
      this.props.toggleAllUserSelect( e.target.checked );
    }
  }
  componentWillReceiveProps = (newProps) => {
     showAllChecked = newProps.showAllChecked;
     selectedCount = newProps.selectedCount;
     temPageSize = this.props.pageSize;
      if(temPageSize  > this.props.dataList.length){
        temPageSize = this.props.dataList.length;
      }
  }
  
  checkSelectAll = () => {//选中的item数目不能及时刷新做的一个特殊处理
      temPageSize = this.props.pageSize;
      if(temPageSize  > this.props.dataList.length){
        temPageSize = this.props.dataList.length;
      }
  }

  preFetchUser = (currentPage, sortBy) => {
    const {entityNoSort, nameSort, createTimeSort} = this.state;
    const {fetchUser, changeOrderType, changeSortType} = this.props;
      switch(sortBy)
      {
        case "entityNo": 
            this.setState({
              entityNoSort: !entityNoSort
            }, () => {
                changeSortType("entityNo");
                changeOrderType(entityNoSort);
                fetchUser(currentPage);
            });
        break;
        case "name": 
            this.setState({
              nameSort: !nameSort
            }, () => {
                changeSortType("name");
                changeOrderType(nameSort);
                fetchUser(currentPage);
            }); 
        break;
        case "createDate": 
            this.setState({
              createTimeSort: !createTimeSort
            }, () => {
                changeSortType("createDate");
                changeOrderType(createTimeSort);
                fetchUser(currentPage);
            });
        break;
      }
  }

  render() {
    let self = this;
    if(selectedCount !== 0 && selectedCount === temPageSize){
        showAllChecked = true;
      }else{
        showAllChecked = false;
      }
    const {nameSort, createTimeSort, entityNoSort} = self.state;
    const {sortType} = self.props;
    let c:Array<TableColumnOpt> = [{
      title: '',
      key: 'checkbox',
      renderer( v:any, rowData:any ) {
          return <input 
                    type="checkbox"
                    checked={rowData.selected}
                    onChange={(e:any)=>{ e.stopPropagation();self.props.toggleUserSelect(rowData.id, e.target.checked ); self.checkSelectAll()}}
                    onClick = {(e:any)=>{e.stopPropagation();}}
                />
      },
      headerRenderer() {
          return <input type="checkbox" checked={showAllChecked ? "checked" : ""} onChange={self.checkedAll}/>
      }
    },
     {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
      title: '',
      key: 'entityNo',
      renderer( v:any, rowData:any ) {
          return rowData.entityNo
      },
      headerRenderer() {
        return <div className="touchStyle" onClick={(e:any)=>{ self.preFetchUser(1,'entityNo') }}>
                    用户编号
                    <div className="sortTableIcon">
                        <i className={entityNoSort ? "fa fa-sort-asc sortleft-top"
                                                   :sortType === "entityNo" 
                                                      ? "fa fa-sort-asc sortleft-top highLightSort" 
                                                      : "fa fa-sort-asc sortleft-top" 
                                      }></i>
                        <i className={entityNoSort 
                                      ? sortType === "entityNo" 
                                          ? "fa fa-sort-desc sortleft-down highLightSort"
                                          : "fa fa-sort-desc sortleft sortleft-down"
                                      : "fa fa-sort-desc sortleft sortleft-down" 
                                        }></i>
                    </div>  
              </div>  
      }
    },
    {
      title: '',
      key: 'name',
      dataIndex: 'name',
      renderer( v:any, rowData:any ) {
          return rowData.name
      },
      headerRenderer() {
        return <div className="touchStyle" onClick={(e:any)=>{ self.preFetchUser(1,'name') }}>
                  姓名
                  <div className="sortTableIcon">
                      <i className={nameSort ? "fa fa-sort-asc sortleft-top"
                                                   :sortType === "name" 
                                                      ? "fa fa-sort-asc sortleft-top highLightSort" 
                                                      : "fa fa-sort-asc sortleft-top" 
                                      }></i>
                        <i className={nameSort 
                                      ? sortType === "name" 
                                          ? "fa fa-sort-desc sortleft-down highLightSort"
                                          : "fa fa-sort-desc sortleft sortleft-down"
                                      : "fa fa-sort-desc sortleft sortleft-down" 
                                        }></i>
                  </div>
              </div>  
      }
    },
    {
        title: '角色',
        dataIndex: 'roleId',
        key: 'roleId',
        renderer: function(value, rowData:Customer, rowIndex, comp){
            let state = userMgmtStore.getState();
            let simpleRoleList = self.props.SimpleRoleList;
            let role = '';
            simpleRoleList.some((item,index)=>{
                let itemIdString = item.id + "";
                if(itemIdString===value) {
                    role = item.name;
                    return true;
                }
            })
            return role;
        }
    },
    {
        title: '层级',
        dataIndex: 'levelId',
        key: 'levelId',
        renderer: function(value, rowData, rowIndex, comp){
            let state = userMgmtStore.getState();
            let selectLevel= self.props.selectHierarchy;
            let level = '';
            selectLevel.some((item,index)=>{
                let itemIdString = item.id + "";
                if(itemIdString===value) {
                    level = item.name;
                    return true;
                }
            })
            
            return level;
        }
    },
    {
        title: '上级用户',
        dataIndex: 'parent',
        key: 'parent',
        renderer: function(value, rowData, rowIndex, comp){
            let state = userMgmtStore.getState();
            let selectLevelCount = self.props.simpleUserList;
            let parentname = '';
            selectLevelCount.some((item,index)=>{
                let itemIdString = item.id + "";
                if(itemIdString===value) {
                    parentname = item.name;
                    return true;
                }
            })
            
            return parentname;
        }
    },
    {
        title: '下级用户',
        dataIndex: 'subUserCount',
        key: 'subUserCount',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '城市',
        dataIndex: 'country',
        key: 'country',
        renderer( v:any, rowData:BWUserDTO ) {
            let country = v ? v : '';
            let province = rowData.province ? rowData.province : '';
            let city = rowData.city ? rowData.city : '';
            let countryText = CountryCityHelper.getText( country) ? CountryCityHelper.getText( country) : '';
            let provinceText = CountryCityHelper.getText(province) ? CountryCityHelper.getText(province) : '';
            let cityText = CountryCityHelper.getText(city) ? CountryCityHelper.getText(city) : ''
            return countryText + ' ' + provinceText + ' ' + cityText
        }
    },
    {
        title: 'MT账号',
        dataIndex: 'login',
        key: 'login',
        renderer( v:any, rowData:any ) {
          return rowData.login
         }
    },
    {
      title: '创建时间',
      key: 'createDate',
      renderer(v:any,rowData:any) {
            return rowData.createDate ? moment(rowData.createDate).format('YYYY-MM-DD HH:mm:ss') : 'N/A'
      },
      headerRenderer() {
        return <div className="touchStyle" onClick={(e:any)=>{ self.preFetchUser(1,'createDate') }}>
                  创建时间
                  <div className="sortTableIcon">
                      <i className={createTimeSort ? "fa fa-sort-asc sortleft-top"
                                                   :sortType === "createDate" 
                                                      ? "fa fa-sort-asc sortleft-top highLightSort" 
                                                      : "fa fa-sort-asc sortleft-top" 
                                      }></i>
                        <i className={createTimeSort 
                                      ? sortType === "createDate" 
                                          ? "fa fa-sort-desc sortleft-down highLightSort"
                                          : "fa fa-sort-desc sortleft sortleft-down"
                                      : "fa fa-sort-desc sortleft sortleft-down" 
                                        }></i>
                  </div>
              </div>  
      }
    }].concat<any>( this.props.colOptions )
  
    c = c.map( colOpt=>{
      if ( colOpt.dataIndex === 'name' ) {
              if(PrivilegeHelper.getHavePrivilege("USER_MODIFY")){
                  return Object.assign( {}, colOpt, {
                    renderer( v:any, rowData:BWUserDTO ) {
                      let parent = rowData.parent ? rowData.parent : 0;
                        return <a className="edit-card"
                                  href="javascript:;"
                                  style={ showEditorLinkStyle }
                                  onClick={ function(){
                                      self.props.showUserEditor(rowData.id);
                                      self.props.SelectLevelCount(rowData.levelId);
                                      self.props.showUpwardReturn(rowData.levelId, parent, rowData.id);
                                      self.props.hideEditCard(true);
                                      if ( self.props.onIdClick ) self.props.onIdClick(rowData.id);
                            } }
                          >
                          {v}
                        </a>
                      }
                  } ); 
              }else{
                return Object.assign( {}, colOpt, {
                    renderer( v:any, rowData:BWUserDTO ) {
                        return <span className="edit-card"
                                     style={ showEditorLinkStyle }
                                >
                                {v}
                              </span>
                      }
                  } ); 
                }
                   
      }else if( colOpt.dataIndex === 'subUserCount' ){
          return Object.assign( {}, colOpt, {
                    renderer( v:any, rowData:BWUserDTO ) {
                        return <span className="edit-card"
                                     style={ showEditorLinkStyle }
                                     onClick={ function(){
                                      self.showTree(rowData.id);
                            }}
                                >
                                {v}
                              </span>
                      }
                  } ); 
      } else {
        return colOpt;
      }
    } )

    return (
      <div>
        <Table
          columns={ c }
          data={ this.props.dataList }
          />
      </div>
    )
  }
}

function mapStateToProps( state:UserAppState ) {
  return {
    colOptions: state.userMgmt.userTableColOptions,
    dataList: state.userMgmt.userList,
    showAllChecked: state.userMgmt.showAllChecked,
    selectedCount: state.userMgmt.userSelectedCount,
    pageSize:state.userMgmt.pageSize,
    sortType: state.userMgmt.sortType,
    selectHierarchy: state.userMgmt.selectHierarchy,
    simpleUserList: state.userMgmt.simpleUserList,
    SimpleRoleList: state.userMgmt.simpleRoleList
  }
}

function mapDispatchToProps( dispatch:Function ) {
  return {
    initCol: function () {
      dispatch( fetchUserTableColumns() )
    },
    fetchUser: function () {
      dispatch( fetchUser() )
    },
    toggleUserSelect: function ( id:any, selected:boolean ) {
      dispatch( toggleUserSelect( id, selected ) );
    },
    toggleAllUserSelect: function ( selected:boolean ) {
      dispatch( toggleAllUserSelect( selected ))
    },
    showUserEditor( id:string ) {
      dispatch( showUserEditor(id) );
    },
    SelectLevelCount(levelId:number) {
      dispatch( SelectLevelCount(levelId) );
    },
    changeShowAllChecked(showAllChecked) {
      dispatch( changeShowAllChecked(showAllChecked) )
    },
    showUpwardReturn(levelId,parent,userId) {
			dispatch(ShowUpwardReturn(levelId,parent, userId))
		},
		showReakRuleDetail(detailId) {
			dispatch(ShowReakRuleDetail(detailId))
		},
    hideEditCard(isHide) {
      dispatch(hideEditCard(isHide))
    },
    changeSortType(sortBy) {
      dispatch(changeSortType(sortBy))
    },
    changeOrderType(orderDesc) {
      dispatch(changeOrderType(orderDesc))
    }
  }
}

export default connect<P,any,any>( mapStateToProps, mapDispatchToProps )( DataTable );