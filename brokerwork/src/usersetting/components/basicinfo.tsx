import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ButtonGroup, Grid, Row, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button,DatePicker, DropdownButton, MenuItem, CountryPicker, Message, SearchBox, NewSelect} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {HttpClient} from '../../http/httpclient';
import {UserHelper} from '../../common/userHelper';
import {FileUpload} from '../../common/fileupload2/fileupload';
import { connect } from 'react-redux';
import { I18nLoader } from '../../i18n/loader';
import FileUploadHelper from '../../common/ossHelper';
import {MainPanelResizeUtil} from '../../common/resize';

import SearchSelect from '../../common/searchInput/searchInput';

var uuid = require('uuid');

let token = UserHelper.getToken();
let userInfo = UserHelper.getUserInfo();

let testText;
interface P {

}
interface S {
    realname?: string,
    headerimg?: string,
    phonelabel?: string,
    emaillabel?:string,
    gender?: string,
    man?: string,
    woman?: string,
    username?: string,
    birthday?: string,
    address?: string,
    yes?: string,
    cancel?: string,
    entityNo?: string,
    basicinfo?: string,
    detailsaddress?: string,
    selfintro?: string,
    parent?: string,
    roleId?: string,
    country?: number,
    province?: number,
    county?: number,
    countryseletstyle?: string,
    countryseletstylefirst?: string,
    proWidth?: number,
    uploadSize?: number,
    uploadTotal?: number,
    isUpload?: boolean,
    selectTime: any,
    headImage: string,
    readonly: string,
    role: string,
    parentName: string,
    serverLabel: string,
    accountInfo: string,
    defaultText: string,
    selectRole:Object,
    selectLevelCount: Object,
    selectServers: Object
    sex:string,
    searchresult:any,
    vendorServerId:string,
    vendor: string,
    server: string,
    isLoading: boolean
}
class BasicInfo extends React.Component<P, S>{
    refs: any;
    avatar: string;
    constructor(props: P) {
        super(props);
        this.avatar = '';
        this.state = {
            realname: I18nLoader.get('user_setting.basic_info.real_name'),
            entityNo: I18nLoader.get('user_setting.basic_info.entity_no'),
            headerimg: I18nLoader.get('user_setting.basic_info.header_img'),
            phonelabel: I18nLoader.get('user_setting.basic_info.phone'),
            emaillabel: I18nLoader.get('user_setting.basic_info.email'),
            gender: I18nLoader.get('user_setting.basic_info.gender'),
            man: I18nLoader.get('user_setting.basic_info.man'),
            woman: I18nLoader.get('user_setting.basic_info.woman'),
            username: I18nLoader.get('user_setting.basic_info.user_name'),
            birthday: I18nLoader.get('user_setting.basic_info.birthday'),
            address: I18nLoader.get('user_setting.basic_info.address'),
            yes: I18nLoader.get('general.save'),
            cancel: I18nLoader.get('general.cancel'),
            basicinfo: I18nLoader.get('user_setting.basic_info.basic_info'),
            detailsaddress: I18nLoader.get('user_setting.basic_info.detail_address'),
            selfintro: I18nLoader.get('user_setting.basic_info.self_intro'),
            parent: "",
            roleId: "",
            country: 0,
            province: 0,
            county: 0,
            countryseletstyle: {width:'100%';display: 'inline-block'},
            countryseletstylefirst: {width:'30%';display:'inline-block'},
            proWidth: 0,
            uploadSize: 0,
            uploadTotal: 0,
            isUpload: false,
            headImage: "../../../images/img-default.png",
            readonly: "",
            role: I18nLoader.get('user_setting.basic_info.role'),
            parentName: I18nLoader.get('user_setting.basic_info.parent_name'),
            serverLabel: I18nLoader.get('user_setting.basic_info.server'),
            accountInfo: I18nLoader.get('user_setting.basic_info.account_info'),
            defaultText:"",
            selectLevelCount: [],
            selectRole: [],
            selectServers: [],
            sex: "",
            searchresult:'',
            vendorServerId:'',
            isLoading: false
        }
    }
    componentWillMount(){
        this.getRole();
        this.getLevel();
        this.getServers();
        HttpClient.doPost('/v1/user/currentUser')
                  .then((res)=>{
                     if (res.result){
                        var data = res.data;
                        let birthday = data.birthday;
                        let venserver;
                        let arr = [];
                        let headerImg;
                        if(!data.headImage){
                            headerImg = "http://broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/img-default.png";
                        }else{
                            headerImg = data.headImage;
                        }
                        if(res.data.vendorServerId === undefined || res.data.vendorServerId === null){
			                ReactDOM.findDOMNode(this.refs.selectServer).value = 0;
		                }else{
                            ReactDOM.findDOMNode(this.refs.selectServer).value = data.vendorServerId;
                        }
                        if(data.vendorServerId){
                            venserver = data.vendorServerId;
                            arr = venserver.split("_"); 
                        }
                        if(data.birthday === ""){
                            birthday = null;
                        }else{
                            birthday = moment(birthday);
                        }
                        this.setState({sex:res.data.sex,
                                       roleId:data.roleId,
                                       parent:res.data.parent,
                                       vendorServerId: res.data.vendorServerId,
                                       country: data.country,
                                       province: data.province,
                                       county: data.city,
                                       searchresult: data.login,
                                       selectTime: birthday,
                                       headImage:  headerImg,
                                       vendor: arr[0],
                                       server: arr[1]
                        },() => {
                            if(!data.username || data.username === undefined || data.username === ""){
                                     this.setState({readonly: ""});
                            }else{
                                this.setState({readonly: "readOnly"});    
                            }
                            ReactDOM.findDOMNode(this.refs.entityNo).value = data.entityNo || "";
                            ReactDOM.findDOMNode(this.refs.realname).value = data.name || "";
                            this.avatar = headerImg;
                            ReactDOM.findDOMNode(this.refs.phone).value = data.phone || "";
                            ReactDOM.findDOMNode(this.refs.email).value = data.email || "";
                            ReactDOM.findDOMNode(this.refs.username).value = data.username || "";
                            ReactDOM.findDOMNode(this.refs.sex).value = data.sex; 
                            ReactDOM.findDOMNode(this.refs.address).value = data.address || "";
                            ReactDOM.findDOMNode(this.refs.comment).value = data.comment || "";
    
                        });
                        
                     }else{
                         Message.error(I18nLoader.getErrorText(res.mcode));
                     }
                })
    }
    componentDidMount(){//初始化获得用户信息
          new MainPanelResizeUtil().register(this);   
    }


    fetchallitem = () => {
          let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
        HttpClient.doPost('/v1/user/currentUser', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        var data = res.data;
                        let birthday = data.birthday;
                        let venserver;
                        let arr = [];
                        let headerImg;
                        if(!data.headImage){
                            headerImg = "http://broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/img-default.png";
                        }else{
                            headerImg = data.headImage;
                        }
                        if(res.data.vendorServerId === undefined || res.data.vendorServerId === null){
			                ReactDOM.findDOMNode(this.refs.selectServer).value = 0;
		                }
                        if(data.vendorServerId){
                            venserver = data.vendorServerId;
                            arr = venserver.split("_"); 
                        }
                        if(data.birthday === ""){
                            birthday = null;
                        }else{
                            birthday = moment(birthday);
                        }
                        this.setState({sex:res.data.sex,
                                       roleId:data.roleId,
                                       parent:res.data.parent,
                                       vendorServerId: res.data.vendorServerId,
                                       country: data.country,
                                       province: data.province,
                                       county: data.city,
                                       selectTime:  birthday,
                                       headImage: headerImg,
                                       searchresult: data.login,
                                       vendor: arr[0],
                                       server: arr[1]
                        }, () => {
                            testText = res.data.login;
                        });
                        if(!data.username || data.username == undefined || data.username == ""){
                            this.setState({readonly: ""});
                        }else{
                            this.setState({readonly: "readOnly"});    
                        }
                        ReactDOM.findDOMNode(this.refs.entityNo).value = data.entityNo || "";
                        ReactDOM.findDOMNode(this.refs.realname).value = data.name || "";
                        this.avatar = headerImg;
                        ReactDOM.findDOMNode(this.refs.phone).value = data.phone || "";
                        ReactDOM.findDOMNode(this.refs.selectServer).value = data.vendorServerId || "";
                        ReactDOM.findDOMNode(this.refs.email).value = data.email || "";
                        ReactDOM.findDOMNode(this.refs.username).value = data.username || "";
                        ReactDOM.findDOMNode(this.refs.address).value = data.address || "";
                        ReactDOM.findDOMNode(this.refs.comment).value = data.comment || "";
                     }else{
                         Message.error(I18nLoader.getErrorText(res.mcode));
                     }
                })
    }

    _onCountyChange = (tempcountry,tempprovince,tempcity) => {//从省市区控件中获取到的国家id省id和区id
           this.setState({country: tempcountry,
                          province: tempprovince,
                          county: tempcity
           });
    }

    savefileName = (fileName) => {
        this.refs.headerimg.src = fileName;
        this.setState({headerImg: fileName});
        this.avatar = fileName;
    }

    handleChangedate = (e) =>{//生日处理
      this.setState({selectTime: e});
    }


    queryContentChangeHandler = (value) => {//回调保存信息
        testText = value;
    }
    //获取角色和用户数据
    getRole = () => {
        HttpClient.doPost('/v1/roleRight/role/list')
           .then(res=>{
               this.setState({selectRole: res.data})
       })
    }
    
    getLevel = () => {
        HttpClient.doPost('/v1/user/listSimpleUser')
           .then(res=>{
               this.setState({selectLevelCount: res.data})
       })
    }

    setSex = (evt) => {
        this.setState({
            sex: evt.target.value
        })
    }

    //获取服务器信息
    getServers = () => {
        HttpClient.doGet( '/v1/account/dropdown/serverList', {
        } ).then(res=>{
            this.setState({selectServers: res.data})
        })
    }

    getvendor = (e) => {
		let arr = e.target.value.split("_"); 
        this.setState({
            vendor: arr[0],
            server: arr[1],
            vendorServerId: e.target.value,
            searchresult: ''
        });
    }

   savebasicinfo = () => {//保存修改过后的基本信息
         this.setState({
             isLoading: true
         });
         let entityNo = ReactDOM.findDOMNode(this.refs.entityNo).value;
         let name = ReactDOM.findDOMNode(this.refs.realname).value;
         let headerImg = this.avatar; //把文件名字传回去
         let phone = ReactDOM.findDOMNode(this.refs.phone).value;
         let email = ReactDOM.findDOMNode(this.refs.email).value;
         let username = ReactDOM.findDOMNode(this.refs.username).value;
         let birthday = this.state.selectTime;
         let country = this.state.country;
         let province = this.state.province;
         let city = this.state.county;
         let sex = ReactDOM.findDOMNode(this.refs.sex).value;
         let vendorServerId = ReactDOM.findDOMNode(this.refs.selectServer).value;
         let login = testText;
         let parent = ReactDOM.findDOMNode(this.refs.levelselect).value;
         let address = ReactDOM.findDOMNode(this.refs.address).value;
         let comment = ReactDOM.findDOMNode(this.refs.comment).value;
         let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          };
         let defaultparam:any = {
             'entityNo': entityNo,
             'headImage': this.avatar,
             'phone': phone,
             'email': email,
             'username': username,
             'birthday': birthday,
             'country': country,
             'province': province,
             'city': city,
             'address': address,
             'comment': comment,
             'roleId': this.state.roleId,
             'parent': parent,
             'name': name,
             'sex': sex,
             'login':login,
             'vendorServerId':vendorServerId
          }
         HttpClient.doPost('/v1/user/updateCurrentUser', defaultparam, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        Message.success(I18nLoader.get('general.save_success'));
                        this.setState({
                            headImage: this.avatar,
                            isLoading: false
                        });
                        this.fetchallitem();
                     }else{ 
                        Message.error(I18nLoader.getErrorText(res.mcode));
                        this.fetchallitem();
                     }
                })
   }

    render() {
        let country = this.state.country;
        let province = this.state.province;
        let county = this.state.county;
        let isChangeReadonly = this.state.readonly ? "readonlytag" : "";
        var defaluttext;
		const {vendor, server, searchresult, vendorServerId, sex, headImage, isLoading} = this.state;
		
        return (
            <div id="main-content" className="merge-left">
                <div className="page-wrapper usermgmt-wrapper">
                <Row>
                  <div className="col-sm-12">
                   <Panel header={this.state.basicinfo} className="main-panel" bsStyle="primary">
                      <Form horizontal sm={12} md={12}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.entityNo}:</span>
                            </Col>
                            <Col sm={3} md={3}>
                                <FormControl ref="entityNo" readOnly className="readonlytag" type="text" placeholder={I18nLoader.get('user_setting.basic_info.entity_no')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.username}:</span>
                            </Col>
                            <Col sm={3} md={3}>
                                <FormControl ref="username" readOnly={this.state.readonly} className={isChangeReadonly} placeholder={I18nLoader.get('user_setting.basic_info.user_name')} type="text" />
                            </Col>
                        </FormGroup>
                        <FormGroup >
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.realname}:</span>
                            </Col>
                            <Col sm={3} md={3}>
                                <FormControl ref="realname" type="text" placeholder={I18nLoader.get('user_setting.basic_info.real_name')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.headerimg}:</span>
                            </Col>
                            <Col sm={3}>
                                <img src={headImage}
                                        ref="headerimg"
                                        className="defaultHeader"
                                        onClick={null}
                                />
                                <FileUpload title={I18nLoader.get('user_setting.basic_info.upload_header_img')}
                                        className="btn-test"
                                        showImagePreview={true}
                                        keepOriginalName={false}
                                        token={token}
                                        uploadFileExtensions={['png','jpg', 'jpeg']}
                                        onUploadComplete={(fileupload, imagePath)=>{this.savefileName(imagePath)}}
                               />
                            </Col>
                        </FormGroup>
                         <FormGroup >
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.phonelabel}:</span>
                            </Col>
                            <Col sm={3}>
                                <FormControl ref="phone" type="phone" placeholder={I18nLoader.get('user_setting.basic_info.phone')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.emaillabel}:</span>
                            </Col>
                            <Col sm={3}>
                                <FormControl ref="email" type="email" readOnly className="readonlytag" placeholder="jane.doe@example.com" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.gender}:</span>
                            </Col>
                            <Col sm={3}>
                                <select className="form-control" ref="sex" onChange={this.setSex} value={sex}>
                                    <option value="-1">{I18nLoader.get('general.default_select')}</option>
                                    <option value="1">{I18nLoader.get('user_setting.basic_info.man')}</option>
                                    <option value="0">{I18nLoader.get('user_setting.basic_info.woman')}</option>
                                </select>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.birthday}:</span>
                            </Col>
                            <Col sm={3}>
                                <DatePicker
                                    ref="birthday"
                                    style={{width: '100%'}}
                                    showYearDropdown
                                    className="form-control"
                                    dateFormat="YYYY-MM-DD"
                                    onChange={this.handleChangedate}
                                    selected={this.state.selectTime}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.role}:</span>
                            </Col>
                            <Col sm={3}>
                                <select className="form-control" ref="roleselcet" value={this.state.roleId} disabled>
                                    {
                                        this.state.selectRole.map((item, index)=>{
                                            return (<option key={index} value={item.id}>{item.name}</option>)
                                        })
                                    }
                                </select>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.parentName}:</span>
                            </Col>
                            <Col sm={3}>
                                <select className="form-control" ref="levelselect" value={this.state.parent} disabled>
                                     <option value="0"></option>
                                    {
                                        this.state.selectLevelCount.map((item, index)=>{
                                            return (<option key={index} value={item.id}>{item.name}</option>)
                                        })
                                    }
                                </select>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.serverLabel}:</span>
                            </Col>
                            <Col sm={3}>
                                <select className="form-control" ref="selectServer" onChange={this.getvendor} value={vendorServerId}>
                                <option value="">{I18nLoader.get('user_setting.basic_info.default_server_select')}</option>
                                    {
                                        this.state.selectServers.map((item, index)=>{
                                            return (<option key={index} data-vendor={item.vendor} data-server={item.serverId} value={item.vendor+"_"+item.serverId}>{item.vendor+"_"+item.serverId+item.desc}</option>)
                                        })
                                    }
                                </select>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.accountInfo}:</span>
                            </Col>
                            <Col sm={3}>
                                 <SearchSelect ref="fuzySearch"
                                              className="fuzysearch"
											  classMenu="aTagStyle"
                                              callbackparent={this.queryContentChangeHandler}
											  defaluttext={searchresult}
                                              vendor={vendor}
                                              server={server}
							               />
                            </Col>
                        </FormGroup>
                        {/*<FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.address}:</span>
                            </Col>
                            <Col sm={3} className="three-select">
                                <CountryPicker country={this.state.country}
                                                countryseletstyle={this.state.countryseletstyle}
                                                countryseletstylefirst={this.state.countryseletstylefirst}
                                                province={this.state.province}
                                                county={this.state.county}
                                                callbackparent={this._onCountyChange} />
                            </Col>
                        </FormGroup>*/}
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.detailsaddress}</span>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="address" placeholder={I18nLoader.get('user_setting.basic_info.detail_address')} type="text" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>{this.state.selfintro}</span>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="comment" placeholder={I18nLoader.get('user_setting.basic_info.self_intro')} type="text" componentClass="textarea"/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={2}>

                            </Col>
                            <Col sm={4}>
                                <Button 
                                    bsStyle="primary" 
                                    className="yesbtn btn-basicinfo" 
                                    onClick={this.savebasicinfo}
                                    disabled={isLoading} 
                                    >
                                        {isLoading ? 'Loading...' : this.state.yes}
                                </Button>
                            </Col>
                        </FormGroup>
                       </Form>
                    </Panel>
                  </div>
                </Row>
                </div>
            </div>

                
        );
    }
}

export {BasicInfo};