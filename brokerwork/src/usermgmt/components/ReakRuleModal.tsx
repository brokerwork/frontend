// libs
import * as React from 'react';
import { Col, Row, Panel} from 'fooui';
import {Table} from 'react-bootstrap';
import { connect } from 'react-redux';
import { UserAppState } from '../store/usermgmtstore';
import { LoadingMask, Message } from 'fooui';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import {ShowReakRuleDetail} from '../actions/useractions';
/* ------------------- main start ---------------------- */


interface P {
   show?: boolean,
   reakRuleDetail?: Object,
   showReakRuleDetail?: Function,
   detailId?:number
}
interface S {
   show:boolean,
   ruleDetail:any
}

class ReakRuleModal extends React.Component<P,S> {
  refs: any;
  static defaultProps:P = {
    show: true,
    reakRuleDetail:[{"name":"本条规则没有数据", "value": ""}]
  };
  constructor( props:any ) {
    super( props );
    this.state = {
			show: this.props.show,
      ruleDetail:[]
		}
  }
  componentWillMount() {
    this.props.showReakRuleDetail(this.props.detailId);
	}
  componentWillReceiveProps = (newProps) => {
    this.setState({
      ruleDetail: newProps.reakRuleDetail
    })
  }

  render() {
    const {reakRuleDetail} = this.props;
    if(reakRuleDetail.length === 0){
      reakRuleDetail[0] = {"name" : "本条规则暂无"}
    }
    let myStyle = {display: this.state.show ? 'block' : 'none'};

    return (
        <div id="tag" style={myStyle}>
            <div className="arrow">
              <em></em><span></span>
            </div>
            <Panel title="返佣参数">
               <div className="ruleDetailTable">
                  <Table bordered>
                    <thead>
                      <tr>
                        {
                          reakRuleDetail.map((item: any, index) => {
													      return (<th key={index}>{item.name}</th>)
											      })
                        }
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                          {
                              reakRuleDetail.map((item: any, index) => {
													        return ( item.value 
                                           ?  <td key={index}>{item.value}</td>
                                           : undefined
                                    )
											        })
                          }
                      </tr>
                    </tbody>
                  </Table>
               </div>
            </Panel>
        </div>

    )
  }
}

function mapStateToProps( state:UserAppState) {
  return {
      reakRuleDetail:state.userMgmt.reakRuleDetail
  }
}
function mapDispatchToProps( dispatch:Function ) {
  return {
      showReakRuleDetail(detailId) {
			  dispatch(ShowReakRuleDetail(detailId))
		}
  }
}

export default connect<P,any,any>(mapStateToProps,mapDispatchToProps,undefined,{
  withRef:true
})(ReakRuleModal);
