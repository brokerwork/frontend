// libs
import * as React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { UserAppState } from '../store/usermgmtstore';
import { Button, DropdownButton, Cascadermenu,
	Table, TableColumnOpt, CustomDateRangePicker,
	Pagination, Panel, Card, Grid, Col, Row, FormControl,
	FormGroup, ControlLabel, Form, Checkbox, InputGroup,
	ButtonGroup, MenuItem, SelectableTable, Message, SearchSelect } from 'fooui';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import { ShowUpwardReturn, 
	ShowReakRuleDetail, 
	showEuReakErrorMsg,
	clearEuErrorMsg} from '../actions/useractions';
import ReakRuleModal from './ReakRuleModal';
import {UserHelper} from '../../common/userHelper';

/* ------------------- main start ---------------------- */
let userInfo = UserHelper.getUserInfo();
let init: boolean = true;
interface P {
   show?: boolean,
   showUpwardReturn?:Function,
   showReakRuleDetail?:Function,
   upWard?: Object,
   changeReakList?:Function,
   showReakErrorMsg?: Function,
   clearErrorMsg?: Function,
   euReakErrorMsg?: string,
   refresh?: boolean,
   callbackparent?: Function,
}
interface S {
   	 reakRuleObject: Object,
	 errorObject:Object,
	 data: any,
	 euReakErrorMsg: string
}

class ReakRuleField extends React.Component<P,S> {
  refs: any;
  static defaultProps:P = {
   		show: true,
		upWard: {}
  };
  constructor( props:any ) {
    super( props );
    this.state = {
            reakRuleObject:{},
			data:[],
			errorObject: {},
			euReakErrorMsg: ""
		}
  }

  initStateData = (upWard, init) => {//初始化数据	
     if(init){
			 let stateData = [];
			 upWard.forEach((item, index) => {
				 if(item.values){
						 stateData[index] = {
							  	ruleId: item.ruleId,
								detailId: item.detailId || 0,
						 } 	
				 }else{
					  stateData[index] = {
							  	ruleId: item.ruleId,
								commissionValue: item.commissionValue || "0",
						 } 
				 }
			})
			this.setState({
					data: stateData
			})
		 }else{
			 let stateData = this.state.data;
			 upWard.forEach((item, index) => {
				 if(item.values){
						 stateData[index] = {
							  	ruleId: item.ruleId,
								detailId: stateData[index].detailId || 0
						 } 	
				 }else{
					  stateData[index] = {
							  	ruleId: item.ruleId,
								commissionValue: stateData[index].commissionValue || "0"
						 } 
				 }
			})
			this.setState({
					data: stateData
			})
		 }
	}

	getValue = () => {
		return this.state.data
	}

	componentWillMount() {
		const {upWard} = this.props;
		let stateData = [];
		this.setState({
			data: []
		});
		upWard.forEach((item, index) => {
			if(item.values){
					stateData[index] = {
						ruleId: item.ruleId,
						detailId: item.detailId || 0,
					} 	
			}else{
				stateData[index] = {
						ruleId: item.ruleId,
						commissionValue: item.commissionValue || "0",
					} 
			}
		})
		this.setState({
				data: stateData
		})
	}

	componentWillReceiveProps = (newProps) => {
		if(newProps.refresh&& newProps.upWard){
			this.initStateData(newProps.upWard, newProps.refresh);
		}
  	}

  showReakRuleModal = (e:any) => {//展示返佣规则提示框
		let index = e.target.getAttribute("data-index");
		let session = this.state.data;
		let ob:Object = session[index];
		if(ob !== undefined){
			this.setState({
			reakRuleObject: Object.assign({[index]:true})
			},() => {
				this.props.callbackparent(false);
			});
		}
  }

  hideReakRuleModal = (e:any) => {//隐藏返佣规则提示框
	  let index = parseInt(e.target.getAttribute("data-index"));
	  let detailValue = !this.state.reakRuleObject[index];
	  this.setState({reakRuleObject: Object.assign({[index]:detailValue})})
  }

  changeDetailId = (e: any) => {//更换当前detailId给浮动数据提示框拉取数据
		let detailId = e.target.value;
		let ruleId = e.target.id;
		let sessiondata = this.state.data;
		let index = e.target.getAttribute("data-ruleunique");
		let field = e.target.getAttribute("data-field");
		sessiondata[index] = {
									ruleId:ruleId,
									detailId: detailId
							 }
	  this.setState({
					data: sessiondata
      })
  }

	changeText = (e: any) => {//这是填入的数据保存方式
		    let maxCommissionValue = e.target.getAttribute("data-maxvalue");
			let index = e.target.getAttribute("data-ruleunique");
			let field = e.target.getAttribute("data-field");
			let ruleId = e.target.id;
			let result = e.target.value;
			let sessiondata = this.state.data;
			const __obj = {
					errorObject: Object.assign({[ruleId]:false}),
					euReakErrorMsg: ""
			};
			if( parseInt(result) > parseInt(maxCommissionValue)){
				__obj['errorObject'] = Object.assign({[ruleId]:true});
				__obj['euReakErrorMsg'] = "不能大于" + maxCommissionValue;
			}
			let resultDot = result.split(".")[1]
			if (resultDot && resultDot.length > 2) {
				var n = Number(result) * 100;
				n = Math.floor(n);
				n = n / 100;
				e.target.value = n;
			}

			if (result < 0){
				result = 0
				e.target.value = 0;			
			}

			if(result === null){
				result = 0;
			}
		
			sessiondata[index] = {
						ruleId: ruleId,
						commissionValue:result
			}
			__obj['data'] = sessiondata;
			this.setState(__obj);
			
	}

	clearReakErrorMsg = () => {
		this.props.showReakErrorMsg('');
	}

	_renderMenu = (menu, index) => {
		if(menu.values) {//大于零是下拉选项
				return (
      				<Col sm={6} className="reaklineheight">
					  	<Col componentClass={ControlLabel} sm={4}>
	 							<div className="reakinline">{menu.name}</div>
								<div className="reakRuleDetail" 
										data-index= {index}
										onMouseEnter={this.showReakRuleModal}
										onMouseLeave={this.hideReakRuleModal}>?
								</div>
								<div className="reakinline">：</div>	
					   </Col>
							 {
            					this.state.reakRuleObject && this.state.reakRuleObject[index]
 								? <ReakRuleModal detailId={this.state.data[index].detailId || "0"}  />
 								: undefined
 					 		}    
						<Col sm={6}>
									<select className="m-bot15 form-control"
											onChange={this.changeDetailId}
											id={menu.ruleId}
											data-field="select"
											data-ruleunique={index}
											value={this.state.data[index].detailId || "0"}
									>
										<option value="0">请选择返佣参数</option>
										{
											menu.values.map((item: any, index) => {
													return (<option key={index} value={item.detailId}>{item.value}</option>)
											})
										} 
									</select>
						</Col>
						<Col sm={2} componentClass={ControlLabel} >{I18nLoader.getErrorText(menu.unit)}</Col>	
			</Col>
				)
		}else{//小于零是输入框
				return(
					<Col sm={6} className="reaklineheight">
						<Col componentClass={ControlLabel} sm={4}>
							{menu.name} ：(上级: {menu.maxCommissionValue} &nbsp;{I18nLoader.getErrorText(menu.unit)}) ：
                		</Col>
						<Col sm={6} className={this.state.errorObject[menu.ruleId] && this.state.euReakErrorMsg
											   ? "has-error"
											   : undefined
										   }>
							<FormGroup>
									<FormControl type="number" 
												 defaultValue={this.state.data[index].commissionValue || "0"} 
												 placeholder="请选择返佣参数"
												 data-ruleunique={index}
												 ref="ruleunique"
												 id={menu.ruleId}
												 onChange={this.changeText}
												 onFocus={this.clearReakErrorMsg}
												 data-maxvalue={menu.maxCommissionValue}
												 min="0"
												 onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
												 onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
												 />
												 {this.state.errorObject[menu.ruleId] && this.state.euReakErrorMsg
													 ? <p className="help-block">{this.state.euReakErrorMsg}</p>
													 : undefined
												 }
							</FormGroup>
						</Col>
						<Col sm={2} componentClass={ControlLabel} >{I18nLoader.getErrorText(menu.unit)}</Col>
					</Col>
				)
		}
  }
  
  render() {
	let {upWard} = this.props;
    return (
  <Panel title="返佣参数" showCollapseIcon={true} className="extraPanel">
					<FormGroup>
          				{ upWard.map(this._renderMenu)}
					</FormGroup>
		</Panel>
    )
  }
}

function mapStateToProps( state:UserAppState) {
  return {
      	upWard:state.userMgmt.upWard,
	  	reakRuleDetail:state.userMgmt.reakRuleDetail,
		euReakErrorMsg: state.userMgmt.euReakErrorMsg
  }
}
function mapDispatchToProps( dispatch:Function ) {
  return {
    	showUpwardReturn(levelId=0,userId,parent=0) {
			dispatch(ShowUpwardReturn(levelId, userId, parent))
		},
		showReakRuleDetail(detailId) {
			dispatch(ShowReakRuleDetail(detailId))
		},
		showReakErrorMsg( msg:any ){
        	dispatch( showEuReakErrorMsg(msg) )
		},
		clearErrorMsg() {
			dispatch(clearEuErrorMsg())
		}
  }
}

export default connect<P,any,any>(mapStateToProps,mapDispatchToProps,undefined,{
  withRef:true
})(ReakRuleField);
