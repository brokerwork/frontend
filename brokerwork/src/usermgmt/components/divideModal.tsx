// libs
import * as React from 'react';
import { Modal, Col, Row } from 'fooui';
import { connect } from 'react-redux';
import { UserAppState } from '../store/usermgmtstore';
import { LoadingMask, Message } from 'fooui';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import { massTransfer, SelectLevelCount,changeShowAllChecked,toggleAllUserSelect} from '../actions/useractions';
/* ------------------- main start ---------------------- */

interface P {
   MassTransfer?:Function,
   selectLevelCount?: Object,
   SelectLevelCount?: Function,
   userHierarchy?:string,
   changeShowAllChecked?:Function,
   toggleAllUserSelect?:Function
}
interface S {
   isShow:boolean,
   isTints: string,
   showSelect: boolean
}

class DivideModal extends React.Component<P,S> {
  refs: any;
  constructor( props:any ) {
    super( props );
    this.state = {
			isShow:false,
      isTints:"",
      showSelect: true
		}
  }

  show = ()=>{
      this.setState({isShow:true,
                      isTints:"是否将选中的用户转移给其他负责人?"}, () => {
                         this.refs.userDivideModal.show();
                    });
    
  }

  close = ()=>{
    this.refs.userDivideModal.close()
  }

  save = ()=>{
    let parent = this.refs.belongToUser.value;
    if(parent === "" || parent === null){
      this.close();
    }else{
        this.props.MassTransfer(parent);
        this.props.changeShowAllChecked(false);
        this.props.toggleAllUserSelect( false);
        this.close();
    }
  }
  
  render() {
    const {isShow, showSelect,  isTints} = this.state;
    const {selectLevelCount} = this.props;
    return (
      <Modal 
        ref="userDivideModal"
        title="划转"
        hasOk
        show={isShow}
        hasCancel
        onOk={this.save}
      >
        <div style={{width:490}} className="line-padding">
        <Row>
             <Col sm={2}>
            </Col>
            <Col sm={10}  style={{textAlign:'left', height: 34,lineHeight:'34px'}}>
              {isTints}
            </Col>
          </Row>
          <Row className={showSelect ? "" : "hideDivideModal"} >
          <Col sm={2}>
            </Col>
            <Col sm={2} style={{textAlign:'left', height: 34,lineHeight:'34px'}}>
              新上级：
            </Col>
            <Col sm={8}>
              <select className="form-control divideModalFont" style={{width:250}} ref="belongToUser">
              {
                selectLevelCount.map( ub=>{
                    return <option value={ub.id}>{ub.entityNo} : {ub.name}</option>
                })
              }
              </select>
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

function mapStateToProps( state:UserAppState) {
  return {
      simpleUserList:state.userMgmt.simpleUserList,
      selectLevelCount: state.userMgmt.selectLevelCount,
      userHierarchy:state.userMgmt.userHierarchy
  }
}
function mapDispatchToProps( dispatch:Function ) {
  return {
    MassTransfer(parent) {
        dispatch( massTransfer(parent) )
    },
    SelectLevelCount(levelId) {
			dispatch(SelectLevelCount(levelId))
		},
    changeShowAllChecked(showAllChecked) {
      dispatch( changeShowAllChecked(showAllChecked) )
    },
    toggleAllUserSelect: function ( selected:boolean ) {
      dispatch( toggleAllUserSelect( selected ))
    },
  }
}

export default connect<P,any,any>(mapStateToProps,mapDispatchToProps,undefined,{
  withRef:true
})(DivideModal);
