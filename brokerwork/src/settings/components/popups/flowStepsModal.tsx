import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Panel, Modal, Row, Col, Button, InputGroup,
    FormGroup, Form, FormControl, ControlLabel, TreeSelect} from 'fooui';
import * as DTO from '../../../taskmgmt/model/index';
import {HttpClient} from '../../../http/httpclient';

interface P{
    addFlowSteps?:Function;
    modFlowSteps?:Function;
}
interface S{
    itemId?:string;
    categoryId?:string;
    flowSteps?:Array<DTO.FlowStep>;
    isModify?:boolean;
    userList?:Array<any>;
}
class FlowStepsModal extends React.Component<P,S> {
    refs: any;
    itemId:string;
    constructor(props:P){
        super(props);
        this.state = {
            itemId:null,
            categoryId:null,
            flowSteps:null,
            userList:[]
        }
    }
    show = (itemId, categoryId, flowSteps)=> {
        this.itemId = itemId;
        this.loadUserList();
        var steps = [];
        steps = steps.concat(flowSteps);
        this.state.flowSteps = steps;
        var isModify = flowSteps.length > 0;
        this.setState({
            itemId: itemId,
            categoryId: categoryId,
            flowSteps: steps,
            isModify: isModify
        })
        this.refs.modal.show();
        setTimeout(()=>{
            this.restoreFields();
        })
    }

    hide = ()=> {
        this.refs.modal.close();
    }

    restoreFields = () => {
        var steps = this.state.flowSteps;
        steps.forEach((step:DTO.FlowStep, index)=>{
            ReactDOM.findDOMNode(this.refs[`stepName${index}`]).value = step.stepName;
            ReactDOM.findDOMNode(this.refs[`processorName${index}`]).value = step.stepUserList.join(',');
            ReactDOM.findDOMNode(this.refs[`passPersonNo${index}`]).value = step.turnouts;
        })
    }

    doSubmit = () => {
        //sync ui with state models.
        var flowSteps:Array<DTO.FlowStep> = this.state.flowSteps;
        flowSteps.forEach((step:DTO.FlowStep, index)=>{
            var stepName = ReactDOM.findDOMNode(this.refs[`stepName${index}`]).value;
            var processors = this.refs[`processorName${index}`].getSelectedItems();
            var passPersonNo = ReactDOM.findDOMNode(this.refs[`passPersonNo${index}`]).value;
            var userList:Array<DTO.KeyValPair> = this.parseMembers(processors);
            step.autoAssign = false;
            step.stepName = stepName;
            step.stepUserList = userList;
            step.turnouts = passPersonNo;
        })
        if (this.state.isModify){
            
            
            this.props.modFlowSteps(this.state.itemId, this.state.categoryId, flowSteps);
        }else{
            
            this.props.addFlowSteps(this.state.itemId, this.state.categoryId, flowSteps);
        }
    }
    loadUserList = () => {
        let url: string = `/v1/tasks/setting/${this.itemId}/participant`;
        HttpClient.doGet(url).
            then( res=>{
                let resultData:any;
                if ( res.result && res.data ) {
                    resultData = res.data.itemUserList;
                    this.setState({userList: resultData});
                }
            });
    }
    parseMembers = (arr=[])=>{
        return arr.map(o=>{
            return new DTO.KeyValPair({name: o.name, key: o.pubUserId || o.key});
        })
    }
    searchProjectMembers = (instance, val) => {
        // this.loadUserList();
    }
    createStepsUI = () => {
        var steps:Array<DTO.FlowStep> = this.state.flowSteps || [];
        var stepPanels: Array<any> = [];
        if (steps.length > 0){ //画全部步骤
            steps.forEach((step:DTO.FlowStep, index: number)=>{
                var n = index + 1; // start from 0
                var st = `第${n}步`;
                var stepNameRef = `stepName${index}`;
                var processorNameRef = `processorName${index}`;
                var passPersonNoRef = `passPersonNo${index}`;

                var stepName = step.stepName;
                var userList = step.stepUserList;
                var turnouts = step.turnouts;
                stepPanels.push(
                    (<div key={index}>
                        <div className="row" style={{'marginBottom': '10px'}}>
                            <h5 className="pull-left">{st}</h5>
                        </div>

                        <div className="row" style={{'marginBottom': '10px'}}>
                            <FormControl ref={stepNameRef}
                                     placeholder="输入步骤名称" style={{width: '20%'}}/>
                        </div>
                        
                        <div className="row" style={{'marginBottom': '10px'}}>
                            <div className="col-sm-1"><h6>处理人</h6></div>
                            <div className="col-sm-6">
                                <TreeSelect ref={processorNameRef}
                                    tags={userList}
                                    tagRender={(item)=>{return item.name}}
                                    searchResultRender={(item)=>{return item.name}}
                                    searchResultItems={this.state.userList}
                                    onChange={this.searchProjectMembers}/>
                            </div>
                            <div className="col-sm-2">
                                <select className="form-control" ref={passPersonNoRef}>
                                    <option value="">审批通过人数</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                    </div>)
                )
            })
        }
        return stepPanels;
    }

    addStep = ()=>{
        var steps = this.state.flowSteps;
        let length: number = steps.length;
        if (length > 0) {
            let index: number = length - 1;
            if (this.refs[`processorName${index}`]) {
                var processors = this.refs[`processorName${index}`].getSelectedItems();
                var userList:Array<DTO.KeyValPair> = this.parseMembers(processors);
                steps[index].stepUserList = userList;
            }
        }
        steps.push(new DTO.FlowStep({
            autoAssign: false,
            stepName: '',
            stepRoleList: [],
            stepUserList: [],
            turnouts: 0
        }))
        this.setState({flowSteps: steps});
    }

    render() {
        return (
            <Modal ref="modal" title={this.state.isModify?"修改处理流程":"添加处理流程"}>
                <div style={{width: 900, height: 500, overflowY:'auto', padding: '0 17px'}}>
                    {this.createStepsUI()}
                    <Row>
                        <Col sm={12}>
                            <div className="pull-right">
                                <Button bsStyle="primary"
                                        className="fa fa-plus"
                                        style={{lineHeight:'inherit'}}
                                        onClick={this.addStep}>添加步骤
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <hr/>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <div className="pull-right">
                                <Button bsStyle="primary" onClick={this.doSubmit}>提交</Button>
                                <Button bsStyle="default" onClick={()=>{this.hide()}}>取消</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default FlowStepsModal;