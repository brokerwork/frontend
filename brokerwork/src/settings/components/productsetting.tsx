import * as React from 'react';
import {ButtonGroup, Table, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Modal, FileUpload, Message, LoadingMask, Pagination} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {HttpClient} from '../../http/httpclient';
import {UserHelper} from '../../common/userHelper';
import {I18nLoader} from '../../i18n/loader';
import FileUploadHelper from '../../common/ossHelper';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';
var uuid = require('uuid');
let token = UserHelper.getToken();

interface P {
  
}
interface S {
   productsettingtitle: string,
   isModify: boolean,
   productjson: any[],
   currentPageNo: number,
   totalPageNo: number,
   total: number,
   pagetotalesize: number,
   uploadTotal: number,
   uploadSize: number,
   proWidth: number,
   isUpload: boolean,
   headImage: string
}

class ProductSetting extends React.Component<P, S>{
    avatar: string;
    contracturl: string;
    constructor(props: P) {
        super(props);
        this.avatar = '';
        this.contracturl = '';
        this.state = {
            productsettingtitle: "产品设置",
            productjson: [],
            pagetotalesize: 10,
            proWidth: 0,
            uploadSize: 0,
            uploadTotal: 0,
            isUpload: false
        }
    }
    componentDidMount(){//初始化获得产品信息
        this.fetchalllist();
    }
    fetchalllist = (currentPageNo:number = 1,pages:number = 10) => {//获取所有产品数据
      let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          LoadingMask.maskAll();
          
          let params = {
            nowPage: currentPageNo,
            pageSize: pages
          }
          HttpClient.doPost('/v1/custom/products/list', params, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        LoadingMask.unmaskAll();
                        this.setState({
                              productjson: res.data.list,
                              total: res.data.total,
                              currentPageNo: currentPageNo,
                              totalPageNo: res.data.pages
                        })
                        this.listItem();
                     }else{
                         LoadingMask.unmaskAll();
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                }
    }
    listItem = () => {//更新数据表格注意map方法和onclick的混合使用
           var createItem = function (array, index) {
                return (<tr>
                      <td>{array.name}</td>
                      <td><img className="exampleImg" src={FileUploadHelper.getFileUrlPrefix() +'/' + array.imageUrl} /></td>
                      <td>{array.productPrice}</td>
                      <td>{array.unit}</td>
                      <td>{array.description}</td>
                      <td><a href={FileUploadHelper.getFileUrlPrefix()+'/'+ array.contractUrl} download="download">下载合同</a></td>
                      <td>
                        <Button bsStyle="primary" className="yesbtn" onClick={this.showeditModal.bind(this,array)}><i className="fa fa-pencil"></i></Button>
                        <Button onClick={this.deleteproduct.bind(this,array)}><i className="fa fa-times"></i></Button>
                       </td>
                      </tr>);
           } 
           return  <tbody>{this.state.productjson.map(createItem.bind(this))}</tbody>
    }

    showaddModal = () => {
       ReactDOM.findDOMNode(this.refs.productPrice).value = null;
       ReactDOM.findDOMNode(this.refs.name).value = null;
       ReactDOM.findDOMNode(this.refs.unit).value = null;
       ReactDOM.findDOMNode(this.refs.description).value = null;
       this.contracturl = "";
       this.avatar = "";
       ReactDOM.findDOMNode(this.refs.productId).value = null;
        this.setState({isModify: false});
        this.refs.productModal.show();
    }
    showeditModal = (array) => {
        this.avatar = array.imageUrl;
        this.contracturl = array.contractUrl;
        ReactDOM.findDOMNode(this.refs.productPrice).value = array.productPrice;
        ReactDOM.findDOMNode(this.refs.name).value = array.name;
        ReactDOM.findDOMNode(this.refs.productId).value = array.productId;
        ReactDOM.findDOMNode(this.refs.unit).value = array.unit;
        ReactDOM.findDOMNode(this.refs.description).value = array.description; 
        this.setState({isModify: true});
        this.refs.productModal.show();
    }
    hide = ()=>{
        this.refs.productModal.close();
    }
    updateproduct = () => {
        let productPrice = ReactDOM.findDOMNode(this.refs.productPrice).value;
        let name = ReactDOM.findDOMNode(this.refs.name).value;
        let unit = ReactDOM.findDOMNode(this.refs.unit).value;
        let description = ReactDOM.findDOMNode(this.refs.description).value;
        let imageUrl = this.avatar;
        let contractUrl = this.contracturl;
        let productId = ReactDOM.findDOMNode(this.refs.productId).value;
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
        let querypararm: any = {
              'productPrice': productPrice,
              'name': name,
              'unit': unit,
              'description': description,
              'imageUrl': imageUrl,
              'contractUrl': contractUrl,
              'productId': productId
            }
          HttpClient.doPost('/v1/custom/products/upsert', querypararm, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                         LoadingMask.unmaskAll();
                         Message.success('更新成功')
                         this.fetchalllist(1);
                         this.hide();
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                }
    }
    addproduct = () => {
        let productPrice = ReactDOM.findDOMNode(this.refs.productPrice).value;
        let name = ReactDOM.findDOMNode(this.refs.name).value;
        let unit = ReactDOM.findDOMNode(this.refs.unit).value;
        let description = ReactDOM.findDOMNode(this.refs.description).value;
        let imageUrl = this.avatar;
        let contractUrl = this.contracturl;
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
        let querypararm: any = {
              'productPrice': productPrice,
              'name': name,
              'unit': unit,
              'description': description,
              'imageUrl': imageUrl,
              'contractUrl': contractUrl,
            }
          HttpClient.doPost('/v1/custom/products/upsert', querypararm, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                         LoadingMask.unmaskAll();
                         Message.success('更新成功')
                         this.fetchalllist(1);
                         this.hide();
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                }
       
    }
    deleteproduct = (array) => {//删除产品
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }

        let valArr : any =  {};
        valArr = array.productId;
        let querypararm:any = [valArr];
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                LoadingMask.maskAll();
                HttpClient.doPost('/v1/custom/products/clear', querypararm, otherHeaders)
                    .then((res) => {
                        if (res.result){
                            Message.success('删除成功')
                            this.fetchalllist(1);
                        }else{
                            Message.error( I18nLoader.getErrorText(res.mcode) );
                            LoadingMask.unmaskAll();
                        }
                    })
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
          
    }
    currentPageNoChangeHandler = ( c:number )=>{
        this.setState({currentPageNo: c});
        this.fetchalllist( c );
    }
    changePageSize = ( pages:number ) => {
        this.setState({pagetotalesize: pages});
        this.fetchalllist(1,pages);
       
    }
    pageSizeChangeHandler = (pageSize:number, current:number)=>{
        this.changePageSize( pageSize );
    }
    savefileName = (fileName) => {
       this.contracturl = fileName;
       this.refs.contracturl.href = FileUploadHelper.getFileUrlPrefix()+'/'+ fileName;
    }
    saveimgName = (fileName) => {
         this.avatar = fileName;
         this.refs.headerimg.src = FileUploadHelper.getFileUrlPrefix()+'/'+ fileName;
    }

    render() {
        let isshow = this.state.isModify ? {display: "inline-block"} : {display: "none"};
        let editmore = this.state.isModify ? {display:'block'} : {display: 'none'};
        return (
            <div style={{"height": window.innerHeight}} className="leftheightcontrol">
                <Panel header={this.state.productsettingtitle} className="changepwd" style={{"height": "auto"}} bsStyle="primary">
                <div id="productsettingcontent">
                   <Table responsive>
                     <thead>
                       <tr>
                         <th>产品名称</th>
                         <th>产品图片</th>
                         <th>产品价格</th>
                         <th>计价单位</th>
                         <th>产品描述</th>
                         <th>产品合同</th>
                         <th>操作</th>
                       </tr>
                    </thead>
                    {this.listItem()}
                   </Table> 
                   <Row> 
                    <Button bsStyle="primary" className="yesbtn pull-right left" onClick={this.showaddModal}><i className="fa fa-plus"></i>添加产品</Button>
                    </Row>
                    <Row className="bottompage">         
                                <div className="col col-md-2">
                                    <span className="pagination-info">共{this.state.total}条</span>
                                </div>
                                <Pagination 
                                    total={ this.state.totalPageNo }
                                    current={ this.state.currentPageNo }
                                    onChange={ this.currentPageNoChangeHandler }
                                    onPageSizeChange={ this.pageSizeChangeHandler }
                                    dropup
                                />
                   </Row> 
                </div>           
            </Panel>
            <Modal show={false} title={this.state.isModify ? '编辑产品' : '添加产品'} ref="productModal" className="settings-model">
                  <Form horizontal id="add-product">
                  <Row>
                       <span className="basiclabel">产品名称: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="name" placeholder="" />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel imglabel"><span id="redstar">*</span>产品图片: </span>
                         <div className="hugbottom">
                           <img src={FileUploadHelper.getFileUrlPrefix()+'/'+ this.avatar} 
                                    ref="headerimg" 
                                    className="defaultHeader" 
                                    onClick={null}
                            />
                            <FileUpload title="上传图片"
                                    className="btn-test"
                                    showImagePreview={true}
                                    keepOriginalName={true}
                                    uploadFileExtensions={['png','jpg']}
                                    onUploadComplete={(fileupload)=>{this.saveimgName(fileupload.fileName)}}
                           />
                       </div>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>产品价格: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="productPrice" placeholder="" />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>计价单位: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="unit" placeholder="" />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>产品描述: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="description" placeholder="" />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>产品合同: </span>
                         <div className="huginner">
                          <FileUpload title="上传合同"
                                    className="contract-test"
                                    hasIcon={false}
                                    showImagePreview={false}
                                    uploadFileExtensions={['xlsx','xls','doc','zip']}
                                    onUploadComplete={(fileupload)=>{this.savefileName(fileupload.fileName)}}
                          />
                         </div>
                  </Row>
                  <Row style={editmore}>
                      <span className="basiclabel"><span id="redstar">*</span>下载合同: </span>
                      <FormGroup className="halfline">
                        <Button type="button" bsStyle="primary" style={isshow}>
                              <a href={FileUploadHelper.getFileUrlPrefix()+'/'+ this.contracturl} ref="contracturl" download="download">
                                下载合同
                               </a>
                        </Button>
                       </FormGroup>
                  </Row>
                  <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="productId"  placeholder="textarea" readOnly />
                  </Row>
                   <Row className="lastline">
                     <FormGroup>
                        <hr className="h-rule h-rule1"/>
                        <Col className="pull-right add-buttons">
                            <Button type="button"bsStyle="primary" onClick={this.state.isModify ? this.updateproduct : this.addproduct}>
                                保存
                            </Button>
                            <Button type="button"
                                onClick={this.hide}
                            >
                                取消
                            </Button>
                        </Col>
                     </FormGroup>
                     </Row>
                  </Form>
               </Modal>
            </div>
        );
    }
}

export {ProductSetting};