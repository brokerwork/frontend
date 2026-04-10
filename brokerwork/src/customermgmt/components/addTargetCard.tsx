import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button, Row, Col,Card} from 'fooui';
import * as classnames from 'classnames';
import {Panel,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup, FormGroup, Form, Checkbox, Modal
} from 'fooui';
import {Table}  from 'react-bootstrap';
import { SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport, FirstQuarterRecord, SecondQuarterRecord, FourthQuarterRecord, ThirdQuarterRecord
} from '../model/salestarget';
import {fetchIndicators,addSalesRecord} from '../actions/salesTargetActions';
import {connect} from 'react-redux';
import {utils} from '../../common/utils';
import {BWUserDTO} from '../../usermgmt/model/user';
import {SalesTargetYears} from './salseTargetYears';

let getValue = utils.getValue;

interface P {
    salestargetDto?: Salestarget;
    indicators?: Array<any>;
    userList: Array<BWUserDTO>
}
interface S {
    salestargetDto?: Salestarget;
    year?:string
}
class AddTargetCard extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            isModify: false,
            salestargetDto: this.props.salestargetDto,
            year: '2014'
        }
    }

    componentDidMount(){
        let dispatch = this.props.dispatch;
        let instance = this;
        dispatch(fetchIndicators())
    }

    show(objectiveId?: string) {
        if (objectiveId != null) {//modify view
            var salestarget: Salestarget = this.findSalesTargetDTO(objectiveId);
            
            this.state.isModify = true;
            this.state.salestargetDto = salestarget;
            this.setState({ isModify: true, salestargetDto: salestarget });
            this.restoreFormData();
            this.refs.addsalesmodal.show();
        } else {
            
            var dto = new Salestarget({});
            this.state.isModify = false;
            this.state.salestargetDto = dto;
            this.setState({ isModify: false, salestargetDto: dto });
            this.restoreFormData();
            this.refs.addsalesmodal.show();
        }
    }

    restoreFormData() {
        let salestargetDto: Salestarget = this.state.salestargetDto;
        let customObjective: ObjectiveReport = getValue(salestargetDto, 'customObjective');
        let firstQuarter: FirstQuarterRecord = getValue(customObjective, 'firstQuarter');
        let secondQuarter: SecondQuarterRecord = getValue(customObjective, 'secondQuarter');
        let thirdQuarter: ThirdQuarterRecord = getValue(customObjective, 'thirdQuarter');
        let fourthQuarter: FourthQuarterRecord = getValue(customObjective, 'fourthQuarter');
        ReactDOM.findDOMNode(this.refs.nickname).value = getValue(customObjective, 'nickname');
        ReactDOM.findDOMNode(this.refs.indicators).value = getValue(customObjective, 'indicators');
        ReactDOM.findDOMNode(this.refs.yearGoal).value = getValue(customObjective, 'yearGoal');
        ReactDOM.findDOMNode(this.refs.year).value = getValue(customObjective, 'year');
        ReactDOM.findDOMNode(this.refs.firstquarterGoal).value = getValue(firstQuarter, 'quarterGoal');
        ReactDOM.findDOMNode(this.refs.secondquarterGoal).value = getValue(secondQuarter, 'quarterGoal');
        ReactDOM.findDOMNode(this.refs.thirdquarterGoal).value = getValue(thirdQuarter, 'quarterGoal');
        ReactDOM.findDOMNode(this.refs.forthquarterGoal).value = getValue(fourthQuarter, 'quarterGoal');
        ReactDOM.findDOMNode(this.refs.firstquarterfirstGoal).value = getValue(firstQuarter, 'firstGoal');
        ReactDOM.findDOMNode(this.refs.firstquartersecondGoal).value = getValue(firstQuarter, 'secondGoal');
        ReactDOM.findDOMNode(this.refs.firstquarterthirdGoal).value = getValue(firstQuarter, 'thirdGoal');
        ReactDOM.findDOMNode(this.refs.secondquarterfirstGoal).value = getValue(secondQuarter, 'firstGoal');
        ReactDOM.findDOMNode(this.refs.secondquartersecondGoal).value = getValue(secondQuarter, 'secondGoal');
        ReactDOM.findDOMNode(this.refs.secondquarterthirdGoal).value = getValue(secondQuarter, 'thirdGoal');
        ReactDOM.findDOMNode(this.refs.thirdquarterfirstGoal).value = getValue(thirdQuarter, 'firstGoal');
        ReactDOM.findDOMNode(this.refs.thirdquartersecondGoal).value = getValue(thirdQuarter, 'secondGoal');
        ReactDOM.findDOMNode(this.refs.thirdquarterthirdGoal).value = getValue(thirdQuarter, 'thirdGoal');
        ReactDOM.findDOMNode(this.refs.forthquarterfirstGoal).value = getValue(fourthQuarter, 'firstGoal');
        ReactDOM.findDOMNode(this.refs.forthquartersecondGoal).value = getValue(fourthQuarter, 'secondGoal');
        ReactDOM.findDOMNode(this.refs.forthquarterthirdGoal).value = getValue(fourthQuarter, 'thirdGoal');

    }


    findSalesTargetDTO(id: string): Salestarget {
        return this.props.salestargets.find((c: Salestarget) => {
            return c.objectiveId == id;
        })
    }
    hide = ()=>{
        this.refs.addsalesmodal.hide();
    }
    getIndicators(): Salestarget {
        var salestargetDto: Salestarget = getValue(this.state, 'salestargetDto');
        var customObjective: ObjectiveReport = getValue(salestargetDto, 'ObjectiveReport');
        var objectiveId = this.state.isModify ? getValue(salestargetDto, 'objectiveId') : null;
        var userId = getValue(customObjective, 'userId');
        var year = ReactDOM.findDOMNode(this.refs.year).value;
        var yearGoal = ReactDOM.findDOMNode(this.refs.yearGoal).value;
        var firstQuarterGoal = ReactDOM.findDOMNode(this.refs.firstquarterGoal).value;
        var secondQuarterGoal = ReactDOM.findDOMNode(this.refs.secondquarterGoal).value;
        var thirdQuarterGoal = ReactDOM.findDOMNode(this.refs.thirdquarterGoal).value;
        var fourthQuarterGoal = ReactDOM.findDOMNode(this.refs.forthquarterGoal).value;
        var firstquarterfirstGoal = ReactDOM.findDOMNode(this.refs.firstquarterfirstGoal).value;
        var firstquartersecondGoal = ReactDOM.findDOMNode(this.refs.firstquartersecondGoal).value;
        var firstquarterthirdGoal = ReactDOM.findDOMNode(this.refs.firstquarterthirdGoal).value;
        var secondquarterfirstGoal = ReactDOM.findDOMNode(this.refs.secondquarterfirstGoal).value;
        var secondquartersecondGoal = ReactDOM.findDOMNode(this.refs.secondquartersecondGoal).value;
        var secondquarterthirdGoal = ReactDOM.findDOMNode(this.refs.secondquarterthirdGoal).value;
        var thirdquarterfirstGoal = ReactDOM.findDOMNode(this.refs.thirdquarterfirstGoal).value;
        var thirdquartersecondGoal = ReactDOM.findDOMNode(this.refs.thirdquartersecondGoal).value;
        var thirdquarterthirdGoal = ReactDOM.findDOMNode(this.refs.thirdquarterthirdGoal).value;
        var forthquarterfirstGoal = ReactDOM.findDOMNode(this.refs.forthquarterfirstGoal).value;
        var forthquartersecondGoal = ReactDOM.findDOMNode(this.refs.forthquartersecondGoal).value;
        var forthquarterthirdGoal = ReactDOM.findDOMNode(this.refs.forthquarterthirdGoal).value;
        var indicators = ReactDOM.findDOMNode(this.refs.indicators).value;
        var nickname = ReactDOM.findDOMNode(this.refs.nickname).value;
        var importance = getValue(customObjective, 'importance');
        var roleName = getValue(customObjective, 'roleName');

        var firstQuarterRecord: FirstQuarterRecord = new FirstQuarterRecord({
            fisrtGoal: firstquarterfirstGoal,
            secondGoal: firstquartersecondGoal,
            thirdGoal: firstquarterthirdGoal,
            quarterGoal: firstQuarterGoal

        })

        var secondQuarterRecord: SecondQuarterRecord = new SecondQuarterRecord({
            firstGoal: secondquarterfirstGoal,
            secondGoal: secondquartersecondGoal,
            thirdGoal: secondquarterthirdGoal,
            quarterGoal: secondQuarterGoal
        })

        var thirdQuarterRecord: ThirdQuarterRecord = new ThirdQuarterRecord({
            firstGoal: thirdquarterfirstGoal,
            secondGoal: thirdquartersecondGoal,
            thirdGoal: thirdquarterthirdGoal,
            quarterGoal: thirdQuarterGoal
        })

        var fourthQuarterRecord: FourthQuarterRecord = new FourthQuarterRecord({
            firstGoal: forthquarterfirstGoal,
            secondGoal: forthquartersecondGoal,
            thirdGoal: forthquarterthirdGoal,
            quarterGoal: thirdQuarterGoal
        })

        var customObjective: ObjectiveReport = new ObjectiveReport({
            firstQuarter: firstQuarterRecord,
            fourthQuarter: fourthQuarterRecord,
            importance: importance,
            indicators: indicators,
            nickname: nickname,
            roleName: roleName,
            secondQuarter: secondQuarterRecord,
            thirdQuarter: thirdQuarterRecord,
            userId: userId,
            year: year,
            yearGoal: yearGoal,
        })

        var SalestargetDto: Salestarget = new Salestarget({
            creatTime: Date.now(),
            creator: 'C',
            customObjective: customObjective,
            enabled: true,
            modifyTime: Date.now(),
            objectiveId: objectiveId,
            tenantId: 'T001001'
        })
        return SalestargetDto;
    }
    addSales = () => {
        var {dispatch} = this.props;
        var SalestargetDto: Salestarget = this.getIndicators();
        this.refs.addsalesmodal.hide();
        dispatch(addSalesRecord(SalestargetDto));
    }
    yearChangeHandler = (e)=>{
        let year = e.target.value;
        this.setState({
            year:year
        })
    }
    indicatorChangeHandler = ( e, v)=>{
        let i = this.refs.indicators.value;
        if (i==='1') {
            ReactDOM.findDOMNode(this.refs.salesTargetUnit).innerHTML = '单位 （人）'
        } else if (i==='2') {
            ReactDOM.findDOMNode(this.refs.salesTargetUnit).innerHTML = '单位 （元）'
        }
    }
    render() {
        let salestargetDto: Salestarget = this.state.salestargetDto;
        let customObjective: ObjectiveReport = getValue(salestargetDto, 'ObjectiveReport');
        let firstQuarterRecord: FirstQuarterRecord = getValue(customObjective, 'FirstQuarterRecord');
        let secondQuarterRecord: SecondQuarterRecord = getValue(customObjective, 'SecondQuarterRecord');
        let thirdQuarterRecord: ThirdQuarterRecord = getValue(customObjective, 'ThirdQuarterRecord');
        let fourthQuarterRecord: FourthQuarterRecord = getValue(customObjective, 'FourthQuarterRecord');
        return (
        <Card ref="addsalesmodal" title={this.state.isModify ? '修改目标' : '新增目标'}>
            <Form horizontal className="add-panel addsale-panel" height="480" >
                <FormGroup>
                    <Col  sm={2}>

                        用户：
                    </Col>
                    <Col sm={10}>
                        <select className="form-control m-bot15"
                                ref="nickname"
                                defaultValue={getValue(customObjective, 'nickname') }>
                            {
                                this.props.userList.map( u=>{
                                    return <option value={u.name}>{u.name}</option>
                                    } )
                                }
                        </select>
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col  sm={2}>

                        考核指标：
                    </Col>
                    <Col sm={10}>
                        <select
                            className="form-control m-bot15"
                            ref="indicators"
                            defaultValue={getValue(customObjective, 'indicators') }
                            onChange={this.indicatorChangeHandler }
                        >
                            {
                                this.props.indicators.map((item)=>{
                                    return (<option value={item.cmId}>{item.zhCN}</option>)
                                    })
                                }
                        </select>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col  sm={2}>

                        年度指标：
                    </Col>
                    <Col sm={10}>

                        <select className="form-control m-bot15 annual-targets"
                                ref="year"
                                value={getValue(customObjective, 'year')||this.state.year}
                                onChange={this.yearChangeHandler}
                        >
                            {
                                SalesTargetYears.map( o=>{
                                    return <option value={o.value}>{o.label}</option>
                                    })
                                }
                        </select>
                        <FormControl type="text" className="unit" ref="yearGoal" defaultValue={getValue(customObjective, 'yearGoal')}/>
                        <span ref="salesTargetUnit">单位 （元）</span>

                    </Col>
                </FormGroup>

                <FormGroup className="table-margin">
                    <Col  sm={2}>

                    </Col>
                    <Col sm={10}>
                        <Table  bordered  hover className="sale-table">
                            <thead>
                                <tr>
                                    <th>第一季度 <FormControl type="text" ref="firstquarterGoal" defaultValue={getValue(firstQuarterRecord, 'quarterGoal') } /></th>
                                    <th>第二季度<FormControl type="text" ref="secondquarterGoal" defaultValue={getValue(secondQuarterRecord, 'quarterGoal') } /></th>
                                    <th>第三季度<FormControl type="text" ref="thirdquarterGoal" defaultValue={getValue(thirdQuarterRecord, 'quarterGoal') } /></th>
                                    <th>第四季度<FormControl type="text" ref="forthquarterGoal" defaultValue={getValue(fourthQuarterRecord, 'quarterGoal') } /></th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.year+'-01'}<FormControl type="text" ref="firstquarterfirstGoal" defaultValue={getValue(firstQuarterRecord, 'firstGoal') } /></td>
                                    <td>{this.state.year+'-04'}<FormControl type="text" ref="secondquarterfirstGoal" defaultValue={getValue(secondQuarterRecord, 'firstGoal') } /></td>
                                    <td>{this.state.year+'-07'}<FormControl type="text" ref="thirdquarterfirstGoal" defaultValue={getValue(thirdQuarterRecord, 'firstGoal') } /></td>
                                    <td>{this.state.year+'-10'}<FormControl type="text" ref="forthquarterfirstGoal" defaultValue={getValue(fourthQuarterRecord, 'firstGoal') } /></td>
                                </tr>
                                <tr>
                                    <td>{this.state.year+'-02'}<FormControl type="text" ref="firstquartersecondGoal" defaultValue={getValue(firstQuarterRecord, 'secondGoal') } /></td>
                                    <td>{this.state.year+'-05'}<FormControl type="text" ref="secondquartersecondGoal" defaultValue={getValue(secondQuarterRecord, 'secondGoal') } /></td>
                                    <td>{this.state.year+'-08'}<FormControl type="text" ref="thirdquartersecondGoal" defaultValue={getValue(thirdQuarterRecord, 'secondGoal') } /></td>
                                    <td>{this.state.year+'-11'}<FormControl type="text" ref="forthquartersecondGoal" defaultValue={getValue(fourthQuarterRecord, 'secondGoal') } /></td>
                                </tr>
                                <tr>
                                    <td>{this.state.year+'-03'}<FormControl type="text" ref="firstquarterthirdGoal" defaultValue={getValue(firstQuarterRecord, 'thirdGoal') } /></td>
                                    <td>{this.state.year+'-06'}<FormControl type="text" ref="secondquarterthirdGoal" defaultValue={getValue(secondQuarterRecord, 'thirdGoal') } /></td>
                                    <td>{this.state.year+'-09'}<FormControl type="text" ref="thirdquarterthirdGoal" defaultValue={getValue(thirdQuarterRecord, 'thirdGoal') } /></td>
                                    <td>{this.state.year+'-12'}<FormControl type="text" ref="forthquarterthirdGoal" defaultValue={getValue(fourthQuarterRecord, 'thirdGoal') } /></td>
                                </tr>
                            </tbody>
                        </Table>

                    </Col>

                </FormGroup>
                <FormGroup>
                    <hr className="h-rule h-rule1"/>
                    <Col className="pull-right add-buttons">
                        <Button type="button" onClick={this.addSales} bsStyle="primary">
                            保存
                        </Button>
                        <Button type="button"
                                onClick={this.hide}
                        >
                            取消
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        </Card>



        )
    }


}

function mapStateToProps(state) {
    return {
        salestargets: state.salesTargetPage.salestargets,
        indicators: state.salesTargetPage.indicators,
        userList: state.salesTargetPage.userList,
    }
}
let AddTargetCard = connect(mapStateToProps, null, null, { withRef: true })(AddTargetCard);
export {AddTargetCard};
