// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { Button, DropdownButton,
    TableColumnOpt, CustomDateRangePicker,
    Pagination, Panel, ButtonGroup, MenuItem, SearchBox, NewSelect, Row, UiPrivilege  } from 'fooui';
import {Modal} from 'fooui';
import {Empty} from '../components/empty';
import {UpdateLevel} from '../components/updateLevel';
import {SubordinateLevel} from '../components/subordinateLevel';
// UI component
import DT from '../components/datatable';
import DTS from '../components/datatablesetting';
import BatchTools from '../components/batchtools';
import {EditUserCard} from '../components/editUser';
import AddUserCard from '../components/addusercard'
import PrivilegeHelper from '../../common/privilegeHelper';
import {UserHelper} from '../../common/userHelper';
import { utils } from '../../common/utils'
// store
import { UserAppState } from '../store/usermgmtstore';
// action
import { 
    fetchUser, 
    changeDateRange, 
    changeUserSearchType, 
    changeQueryContent,
    changeQueryType,
    SimpleUserList,
    toggleAllUserSelect, 
    changePageSize,
    SelectRole,
    SelectHierarchy,
    SelectLevelCount, 
    fetchUserTableColumns, 
    GetServer,
    changeUserHierarchy,
    ShowUpwardReturn,
    hideAddCard,
    changeShowAllChecked,
    GetPasswordStrength,
    SimpleRoleList,
    hideEditCard,
    changeCurrentPageNo } from '../actions/useractions';
// enums
import { UserSearchType } from '../enums/userSearchType';
import {MainPanelResizeUtil} from '../../common/resize';

/* ------------------- privilegeControl ---------------------- */
/* ------------------- main start ---------------------- */
let levelType: any;
const userInfo = UserHelper.getUserInfo();

interface UserMgmtProps {
    showBatchTools?: boolean,
    fetchUser?: Function,
    startDate?: moment.Moment,
    endDate?: moment.Moment,
    changeDateRange?: Function,
    userSearchType?:string,
    changeUserSearchType?: Function,
    queryContent?: string,
    changeQueryContent?: Function,
    changeQueryType?: Function,
    totalPageNo?: number,
    total?: number,
    currentPageNo?: number,
    toggleAllUserSelect?: Function,
    changePageSize?: Function,
    initCol?: Function,
    selectRole?: Function,
    SelectHierarchy?:Function,
    selectHierarchy?:Object,
    selectLevelCount?:Function,
    simpleUserList?:Function,
    getserver?: Function,
    changeUserHierarchy?:Function,
    changeShowAllChecked?: Function,
    SelectLevelCount?: Function,
    showUpwardReturn?: Function,
    hideAddCard?: Function,
    getPasswordStrength?: Function,
    changeCurrentPageNo?: Function,
    simpleRoleList?: Function,
    isEditCardHide?:boolean,
    hideEditCard?: Function,
    isAddCardHide?: boolean
}

interface S {
  showEditCard: boolean
}


class UserMgmt extends React.Component<UserMgmtProps, S> {
    refs:any;
    constructor( props:any ) {
        super( props );
        this.state = {
            showEditCard: this.props.isEditCardHide
        }
    }

    openUserEditor = ()=>{
            this.props.hideEditCard(true);
    }
        
    addUsers = ()=>{
        this.props.showUpwardReturn(0, 0, 0);
        this.props.hideAddCard(true);
    }
    showTableSettingDialog = ()=>{
        this.refs.tableSettingDialog.getWrappedInstance().show()
    }
    // 清空提示
    empty=()=>{
          Modal.show({
                title: '提示',
                onCancel: ()=>{},
                content: <Empty/>
            })
    }

       // 下属层级
    subordinate=()=>{
         Modal.show({
                title: '下属层级',
                onCancel: ()=>{},
                content: <SubordinateLevel/>,
                className:"set-height"
            })
    }
    // 修改下级
    updatelevel=()=>{
        Modal.show({
            title: '修改上级',
            onCancel: ()=>{},
            content: <UpdateLevel/>

    })
    }

    saveTableSettingHandler = ( hideColumns:Array<TableColumnOpt>, showColumns:Array<TableColumnOpt> )=>{
        this.setState( {
            tableColums: showColumns,
            additionalTableColums: hideColumns
        } )
    }

    showBatchTools = ( selectedCount:number)=>{
        let btc = this.refs.batchToolsCmpt;
        btc.setSelectedCount( selectedCount )
        btc.show();
        this.setState( {
            showSearchTools: false
        } )
    }

    hideBatchTools = ()=>{
        this.refs.batchToolsCmpt.hide();
        this.setState( {
            showSearchTools: true
        } )
    }

    doFuzySearch = ()=>{
        const {changeCurrentPageNo} = this.props;
        changeCurrentPageNo(1);
        let queryType = this.refs.senseItem.getCurrentItemValue();
        let content = this.refs.fuzySearch.getValue();
        this.props.changeQueryContent( content );
        this.props.changeQueryType( queryType );
        this.props.fetchUser()
    }

    dateChangeHandler = ( startDate:moment.Moment, endDate:moment.Moment )=>{
        const {changeCurrentPageNo} = this.props;
        changeCurrentPageNo(1);
        this.props.changeDateRange( startDate, endDate );
        this.props.fetchUser();
    }

    userTypeChangeHandler = ()=>{
        const {changeCurrentPageNo} = this.props;
        changeCurrentPageNo(1);
        var userSearchType = this.refs.userDropdown.getCurrentItemValue();
        this.props.changeUserSearchType( userSearchType );
        this.props.fetchUser();
    }
    levelChangeHandler = () =>{
        var levelSearchType = this.refs.levelDropdown.getCurrentItemValue();  
        const {changeCurrentPageNo} = this.props;
        changeCurrentPageNo(1);
        this.props.changeQueryType( "LEVEL" );
        this.props.changeQueryContent( levelSearchType );
        this.props.changeUserHierarchy(levelSearchType);
        this.props.fetchUser();
        if(levelSearchType.length !== 0){
            this.props.SelectLevelCount(levelSearchType);
        }
    }

    queryContentChangeHandler = ( v:any )=>{
        this.props.changeQueryContent( v )    
    }

    queryTypeChangeHandler = ()=>{
        let queryType = this.refs.senseItem.getCurrentItemValue();
        this.props.changeQueryType( queryType );
    }
    currentPageNoChangeHandler = ( c:number )=>{
        const {changeCurrentPageNo, changeShowAllChecked, toggleAllUserSelect, fetchUser} = this.props;
        changeCurrentPageNo(c);
        changeShowAllChecked(false);
        toggleAllUserSelect(false);
        fetchUser();
    }

    pageSizeChangeHandler = (pageSize:number, current:number)=>{
        this.props.changePageSize( pageSize );
        this.props.fetchUser();
    }

    componentDidMount(){
        new MainPanelResizeUtil().register(this);
        this.props.initCol();
        this.props.simpleRoleList();
        this.props.selectRole();
        this.props.SelectHierarchy();
        this.props.simpleUserList();
        this.props.getserver();
        this.props.getPasswordStrength();
        this.props.fetchUser();
    }
    componentWillReceiveProps = (newProps) => {
                levelType = this.props.selectHierarchy.map((item: any, index)=>{
                         return ({label:item.name,value:item.id})
                      })
                let defaultOption = {label:"所有层级" , value: ""}
                levelType.unshift(defaultOption);
                if(newProps.isEditCardHide){
                    this.setState({
                        showEditCard: newProps.isEditCardHide
                    })
                }
    }
    render() {
        let privilegeType : any;
        const {isEditCardHide, isAddCardHide} = this.props;
        privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '直属下级', value: UserSearchType.Sub},
                    {label: '非直属下级', value: UserSearchType.SubBelong},
                    {label: '无上级', value: UserSearchType.NoParent}
                    ]
        let USER_SELECT_DIRECTLY  = PrivilegeHelper.getHavePrivilege("USER_SELECT_DIRECTLY");
        let USER_SELECT_SUBORDINATE = PrivilegeHelper.getHavePrivilege("USER_SELECT_SUBORDINATE");
        let USER_SELECT_ALL = PrivilegeHelper.getHavePrivilege("USER_SELECT_ALL");
        let USER_SELECT_WILD = PrivilegeHelper.getHavePrivilege("USER_SELECT_WILD");
        let btnprivilege = "所有用户";
        if (USER_SELECT_DIRECTLY && USER_SELECT_SUBORDINATE && USER_SELECT_ALL && USER_SELECT_WILD){
         privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '直属下级', value: UserSearchType.Sub},
                    {label: '非直属下级', value: UserSearchType.SubBelong},
                    {label: '无上级', value: UserSearchType.NoParent}
                    ]
        }else if (USER_SELECT_DIRECTLY && !USER_SELECT_SUBORDINATE && !USER_SELECT_ALL && !USER_SELECT_WILD){
            privilegeType = [
                    {label: '直属下级', value: UserSearchType.Sub}]
            btnprivilege = "直属下级";
        }else if (!USER_SELECT_DIRECTLY && USER_SELECT_SUBORDINATE && !USER_SELECT_ALL && !USER_SELECT_WILD){
            privilegeType = [
                    {label: '非直属下级', value: UserSearchType.SubBelong}
            ]
            btnprivilege = "非直属下级";
        }else if (!USER_SELECT_DIRECTLY && !USER_SELECT_SUBORDINATE && !USER_SELECT_ALL && USER_SELECT_WILD){
            privilegeType = [
                    {label: '无上级', value: UserSearchType.NoParent}]  
            btnprivilege = "无上级";   
        }else if ( !USER_SELECT_DIRECTLY && !USER_SELECT_SUBORDINATE && USER_SELECT_ALL && !USER_SELECT_WILD){
            privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee}] 
            btnprivilege = "所有用户"; 
        }else if ( USER_SELECT_DIRECTLY && USER_SELECT_SUBORDINATE && !USER_SELECT_WILD){
                privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '直属下级', value: UserSearchType.Sub},
                    {label: '非直属下级', value: UserSearchType.SubBelong}] 
               btnprivilege = "所有用户"; 
        }else if ( USER_SELECT_DIRECTLY && !USER_SELECT_SUBORDINATE && USER_SELECT_WILD){
                privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '直属下级', value: UserSearchType.Sub},
                    {label: '无上级', value: UserSearchType.NoParent}]
                btnprivilege = "所有用户";  
        }else if ( USER_SELECT_DIRECTLY && !USER_SELECT_SUBORDINATE && USER_SELECT_ALL && !USER_SELECT_WILD){
                privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '直属下级', value: UserSearchType.Sub}]
                btnprivilege = "所有用户";  
        }else if ( !USER_SELECT_DIRECTLY && USER_SELECT_SUBORDINATE && USER_SELECT_ALL && !USER_SELECT_WILD){
                privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '非直属下级', value: UserSearchType.SubBelong}]
                btnprivilege = "所有用户";  
        }else if ( !USER_SELECT_DIRECTLY && USER_SELECT_SUBORDINATE && USER_SELECT_ALL && USER_SELECT_WILD){
                privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '非直属下级', value: UserSearchType.SubBelong},
                    {label: '无上级', value: UserSearchType.NoParent}]
                btnprivilege = "所有用户";  
        }else if ( !USER_SELECT_DIRECTLY && !USER_SELECT_SUBORDINATE && USER_SELECT_ALL && USER_SELECT_WILD){
                privilegeType = [
                    {label: '所有用户', value: UserSearchType.AllSee},
                    {label: '无上级', value: UserSearchType.NoParent}]
                btnprivilege = "所有用户";  
        }
        return (
            <div id="main-content" className="merge-left">
                <div className="page-wrapper usermgmt-wrapper">
                <Row>
                  <div className="col-sm-12">
                        {/* content main panel begin */}
                        <Panel title="用户管理" className="main-panel">
                                <div
                                    className="usermgmt-toolbar"
                                    style={{display: this.props.showBatchTools ? 'none':'inline-block'}}
                                >
                                    <Button bsClass="btn btn-primary fa fa-plus" className={PrivilegeHelper.getHavePrivilege("USER_ADD") ? "privilegeYes" : "privilegeNo"} onClick={this.addUsers}> 添加</Button>
                                    <div className={PrivilegeHelper.getHavePrivilege("USER_SELECT") ? "privilegeYes search-filter-group" : "privilegeNo"}>
                                        <NewSelect options={privilegeType}
                                                iconRight={"fa fa-angle-down"}
                                                isChangeText={true}
                                                btnText={btnprivilege}
                                                className="ghost-btn menu-btn newselect-menu"
                                                onChange={this.userTypeChangeHandler}
                                                ref="userDropdown"
                                        />
                                        <NewSelect options={levelType}
                                                iconRight={"fa fa-angle-down"}
                                                isChangeText={true}
                                                btnText="所有层级"
                                                className="ghost-btn menu-btn newselect-menu"
                                                onChange={this.levelChangeHandler}
                                                ref="levelDropdown"
                                        />
                                        {
                                        <ButtonGroup className="usermgmt-dp">
                                            <Button bsStyle="white">创建时间</Button>
                                            <CustomDateRangePicker 
                                                defaultStartDate={ this.props.startDate}
                                                defaultEndDate={ this.props.endDate }
                                                onRangeChange={ this.dateChangeHandler }
                                                className="inline-calendar"/>
                                        </ButtonGroup>    
                                        }
                                    </div>
                                </div>
                                <BatchTools  toggleAllUserSelect={this.props.toggleAllUserSelect}/>
                                <div className="fuzzy-search-group pull-right">
                                    <NewSelect options={[
                                                            { label: '用户编号', value: 'ENTITY_NO' },
                                                            { label: '角色', value: 'ROLE' },
                                                            { label: '姓名', value: 'NAME' },
                                                            { label: '邮箱', value: 'EMAIL' },
                                                            { label: '手机', value: 'PHONE' }
                                                        ]}
                                            iconRight={"fa fa-angle-down"}
                                            isChangeText={true}
                                            btnText="用户编号"
                                            className="ghost-btn menu-btn newselect-menu"
                                            onChange={this.queryTypeChangeHandler}
                                            ref="senseItem"
                                    />

                                    <SearchBox ref="fuzySearch"
                                                width={300}
                                                value={ this.props.queryContent }
                                                onChange={ this.queryContentChangeHandler }
                                                onEnter={this.doFuzySearch}
                                                onSearch={this.doFuzySearch}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <DT
                                            onIdClick={ this.openUserEditor }
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    
                                        <div className="col col-md-2">
                                            <p className="pages-color">共&nbsp;<span className="number-color">{this.props.total}</span>&nbsp;条, 当前第&nbsp;<span className="number-color">{this.props.currentPageNo}</span>&nbsp;页</p>
                                        </div>
                                        <Pagination 
                                            total={ this.props.totalPageNo }
                                            current={ this.props.currentPageNo }
                                            onChange={ this.currentPageNoChangeHandler }
                                            onPageSizeChange={ this.pageSizeChangeHandler }
                                            pageSizeOptions={[10,20,50,100]}
                                        />
                                    
                                </div>
                        </Panel>
                        {/* content main panel end */}
                        <DTS ref="tableSettingDialog" />
                        {
                            isEditCardHide
                            ? <EditUserCard ref="editUserCard" />
                            : undefined
                        }
                        {
                            isAddCardHide
                            ? <AddUserCard ref="addUserCard"/>
                            : undefined
                        }
                        
                        
                    </div>      
                </Row>
                </div>
            </div>
            
        )
    }
}

function mapStateToProps( state:UserAppState ) {
    return {
        showBatchTools: state.userMgmt.showBatchTools,
        startDate: state.userMgmt.startDate,
        endDate: state.userMgmt.endDate,
        userSearchType: state.userMgmt.userSearchType,
        totalPageNo: state.userMgmt.totalPageNo,
        currentPageNo: state.userMgmt.currentPageNo,
        total: state.userMgmt.total,
        simpleUserList: state.userMgmt.simpleUserList,
        selectHierarchy: state.userMgmt.selectHierarchy,
        isEditCardHide: state.userMgmt.isEditCardHide,
        isAddCardHide: state.userMgmt.isAddCardHide
    }
}

function mapDispatchToProps( dispatch:Function ) {
    return {
        fetchUser: function( c:number ) {
            dispatch( fetchUser( c ) );
        },
        changeDateRange( s:moment.Moment, e:moment.Moment ) {
            dispatch( changeDateRange( s, e ) )
        },
        changeUserSearchType( t:string ) {
            dispatch( changeUserSearchType( t ) )
        },
        changeQueryContent( v:string ) {
            dispatch( changeQueryContent( v ) )
        },
        changeQueryType( v:string ) {
            dispatch( changeQueryType(v))
        },
        toggleAllUserSelect: function (selected:boolean) {
            dispatch(toggleAllUserSelect(selected));
        },
        changePageSize( pageSize:number) {
            dispatch( changePageSize(pageSize) )
        },
        initCol: function () {
            dispatch( fetchUserTableColumns() )
        },
        selectRole: function () {
            dispatch( SelectRole() )
        },
        simpleRoleList: function () {
             dispatch( SimpleRoleList() )
        },
        SelectHierarchy() {
           dispatch(SelectHierarchy())  
        },
        selectLevelCount(levelId) {
            dispatch(SelectLevelCount( levelId )) 
        },
        getserver(){
            dispatch(GetServer())
        },
        simpleUserList() {
            dispatch(SimpleUserList()) 
        },
        changeUserHierarchy(levelId) {
           dispatch(changeUserHierarchy(levelId));  
        },
        changeShowAllChecked(showAllChecked) {
            dispatch( changeShowAllChecked(showAllChecked) )
        },
        SelectLevelCount(levelId) {
			dispatch(SelectLevelCount(levelId))
		},
        showUpwardReturn(levelId=0,userId,parent=0) {
			dispatch(ShowUpwardReturn(levelId, userId, parent))
		},
        hideAddCard(isHide) {
            dispatch(hideAddCard(isHide))
        },
        hideEditCard(isHide) {
      		dispatch(hideEditCard(isHide))
    	},
        getPasswordStrength() {
            dispatch(GetPasswordStrength())
        },
        changeCurrentPageNo(currentPageNo) {
            dispatch(changeCurrentPageNo(currentPageNo))
        }
    }
}

export let UserMgmtIndex = connect<any,any,any>(mapStateToProps, mapDispatchToProps)(UserMgmt);
