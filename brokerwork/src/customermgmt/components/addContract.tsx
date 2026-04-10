import * as React from 'react';
import {Card, Panel, FormGroup, Col,
    FormControl, Form, ControlLabel,
    Button, FileUpload, Row, CustomDateRangePicker} from 'fooui';
import * as ReactDOM from 'react-dom';
import {Table} from 'react-bootstrap';
import {CustomerContractsDTO, CustomRedundancy, CustomContract, KeyValPair} from '../model/salescontract';
import {addSalesContract, modifySalesContract} from '../actions/salesContractActions';
import {connect} from 'react-redux';
import {utils} from '../../common/utils';

let getValue = utils.getValue;

interface P{
    contractDto?: CustomerContractsDTO;
    modifySalesContract?: Function;
    addSalesContract?: Function;

}
interface S{
    contractDto?: CustomerContractsDTO;
    isModify?:boolean;
}
class AddContractCard extends React.Component<P,S>{
    constructor(props:P){
        super(props);
        this.state = {
            isModify: false,
            contractDto: this.props.contractDto
        }
    }

    show(contract:CustomerContractsDTO){
        if (contract != null){
            this.setState({
                isModify: true,
                contractDto: contract
            })
        }else{
            this.setState({
                isModify: false,
                contractDto: null
            })
        }
        this.refs.addContract.show();
        this.restoreForm(contract);
    }

    restoreForm(contract:CustomerContractsDTO){
        let dto:CustomerContractsDTO = contract;
        let redundancy:CustomRedundancy = utils.getValue(dto, 'redundancy');
        let customContract:CustomContract = utils.getValue(dto, 'customContract');
        let product:KeyValPair = utils.getValue(customContract, 'product');

        let customerName = utils.getValue(redundancy, 'customName');
        let totalPrice = utils.getValue(customContract, 'totalAmount');
        let startdate = utils.getValue(customContract, 'contractStartDay'); //期限?
        let enddate = utils.getValue(customContract, 'contractEndDay'); //期限?
        this.refs.dateRange.setSelectedRange([moment(startdate), moment(enddate)])
        , moment(enddate))
        let productName = utils.getValue(product, 'name');
        let signTime = utils.getValue(customContract, 'signTime');
        let comments = utils.getValue(customContract, 'comments');
        ReactDOM.findDOMNode(this.refs.customerName).value = customerName;
        ReactDOM.findDOMNode(this.refs.totalPrice).value = totalPrice;
        ReactDOM.findDOMNode(this.refs.productName).value = productName;
        ReactDOM.findDOMNode(this.refs.signTime).value = signTime;
        ReactDOM.findDOMNode(this.refs.comments).value = comments;
    }

    hide(){
        this.refs.addContract.hide();
    }

    addModContract = ()=>{
        if (this.state.isModify){
            var dto: CustomerContractsDTO = this.state.contractDto;
            let customerName = ReactDOM.findDOMNode(this.refs.customerName).value;
            let totalPrice = ReactDOM.findDOMNode(this.refs.totalPrice).value;
            let range = this.refs.dateRange.getSelectedRange();
            let startdate = range[0];
            let enddate = range[1];
            let productName =  ReactDOM.findDOMNode(this.refs.productName).value;
            let signTime = ReactDOM.findDOMNode(this.refs.signTime).value;
            let comments = ReactDOM.findDOMNode(this.refs.comments).value;
            dto.redundancy.customName = customerName;
            dto.customContract.totalAmount = totalPrice;
            dto.customContract.contractStartDay = startdate;
            dto.customContract.contractEndDay = enddate;
            dto.customContract.product.name = productName;
            dto.customContract.signTime = signTime;
            dto.customContract.comments = comments;
            this.props.modifySalesContract(dto);
            this.hide();
        }else{
            var dto:CustomerContractsDTO = this.createNewContractObject();
            this.props.addSalesContract(dto);
            this.hide();
        }
    }
    _onClickCancel = ()=> {
        this.hide();
    }
    createNewContractObject = ()=>{
        let customerName = ReactDOM.findDOMNode(this.refs.customerName).value;
        let totalPrice = ReactDOM.findDOMNode(this.refs.totalPrice).value;
        let range = this.refs.dateRange.getSelectedRange(); //合同期限
        let startdate = range[0];
        let enddate = range[1];
        let productName =  ReactDOM.findDOMNode(this.refs.productName).value;
        let signTime = ReactDOM.findDOMNode(this.refs.signTime).value;
        let comments = ReactDOM.findDOMNode(this.refs.comments).value;

        var contract:CustomerContractsDTO = new CustomerContractsDTO({
            customContract: new CustomContract({}),
            redundancy: new CustomRedundancy({})
        });
        contract.createTime = Date.now();
        contract.creator = 'sam';
        contract.customContract.totalAmount = totalPrice;
        contract.customContract.contractStartDay = startdate;
        contract.customContract.contractEndDay = enddate;
        contract.customContract.signTime = signTime;
        contract.customContract.comments = comments;
        return contract;
    }
    render(){

        return (
            <Card ref="addContract"
                  shownClass="addcontract-card-show"
                  title={this.state.isModify ? '修改合同' : '添加合同'}
                  className="add-card-cus">
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            <span className="important-info">* </span><span>客户名称：</span>
                        </Col>
                        <Col sm={9}>
                            <FormControl ref="customerName" className="disabled"/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            <span className="important-info">* </span><span>总金额：</span>
                        </Col>
                        <Col sm={9}>
                            <FormControl ref="totalPrice"/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            <span className="important-info">* </span><span>合同期限：</span>
                        </Col>
                        <Col sm={9}>
                            <CustomDateRangePicker ref="dateRange" opens="left"
                                                   />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            <span>产品：</span>
                        </Col>
                        <Col sm={9}>
                            <FormControl ref="productName"/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            <span>签约时间：</span>
                        </Col>
                        <Col sm={9}>
                            <FormControl ref="signTime"/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={3}>
                            <span>备注：</span>
                        </Col>
                        <Col sm={9}>
                            <FormControl ref="comments"/>
                        </Col>
                    </FormGroup>
                </Form>
                <hr/>
                <Row>
                    <Col md={12}>
                        <div className="pull-right">
                            <Button bsStyle="primary" onClick={this.addModContract}>保存</Button>
                            <Button onClick={this._onClickCancel}>取消</Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        )
    }
}
function mapStateToProps(state){
    return {

    }
}

function mapDispatchToProps(dispatch){
    return {
        addSalesContract: function(contract){
            dispatch(addSalesContract(contract));
        },
        modifySalesContract: function(contract){
            dispatch(modifySalesContract(contract));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AddContractCard);
