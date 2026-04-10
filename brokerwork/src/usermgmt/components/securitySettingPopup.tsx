// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// UI
import { 
  Modal, 
  FormGroup, 
  Col, 
  ControlLabel, 
  FormControl,
  Button 
} from 'fooui'
/* ------------------- main start ---------------------- */

const PREFIX_WHITE_LIST_FROM = 'wlfrom';
const PREFIX_WHITE_LIST_TO = 'wlto';
const PREFIX_BLACK_LIST_FROM = 'blfrom';
const PREFIX_BLACK_LIST_TO = 'blto';

function getInputValue( cmpt:React.Component<any,any>) {
  let el:any = ReactDOM.findDOMNode( cmpt );
  return el.value;
}

interface S {
  whiteList?: Array<number>,
  blackList?: Array<number>
}

class SecuritySettingPopup extends React.Component<{},S> {
  refs:any;
  constructor( props:any ) {
    super( props );
    this.state = {
        whiteList: [1],
        blackList: [1]
    }
  }
  addWhiteList = ()=>{
      let wl = this.state.whiteList;
      let lastIndex = wl[wl.length-1];
      this.setState({
          whiteList: wl.concat<any>([++lastIndex])
      })
  }

  addBlackList = ()=>{
      let bl = this.state.blackList;
      let lastIndex = bl[bl.length-1];
      this.setState({
          blackList: bl.concat<any>([++lastIndex])
      })
  }

  removeWhiteList = (e:any)=>{
      let wl = this.state.whiteList;
      let el = e.currentTarget;
      let index = el.dataset.index;
      let indexIndex = wl.findIndex( i=>{
          return (''+i) === index
      });

      this.setState( {
          whiteList: [
              ...wl.slice(0,indexIndex),
              ...wl.slice(indexIndex+1,wl.length)
          ]
      } )
  }

  removeBlackList = (e:any)=>{
        let bl = this.state.blackList;
        let el = e.currentTarget;
        let index = el.dataset.index;
        let indexIndex = bl.findIndex( i=>{
            return (''+i) === index
        });

        this.setState( {
            blackList: [
                ...bl.slice(0,indexIndex),
                ...bl.slice(indexIndex+1,bl.length)
            ]
        } )
  }

  show = ()=>{
    this.refs.m.show()
  }

  saveSecuritySetting = ()=>{
    let wlArray:any = [];
    let blArray:any = [];
    this.state.whiteList.forEach( index=>{
      wlArray.push( {
        from: getInputValue( this.refs[PREFIX_WHITE_LIST_FROM+index] ),
        to: getInputValue( this.refs[PREFIX_WHITE_LIST_TO+index] )
      } )
    } );
    this.state.blackList.forEach( index=>{
      blArray.push( {
        from: getInputValue( this.refs[PREFIX_BLACK_LIST_FROM+index] ),
        to: getInputValue( this.refs[PREFIX_BLACK_LIST_TO+index] )
      } )
    } );
    
    
  }

  render() {
    return (
      <Modal 
        show={false} 
        ref="m"
        title="安全控制"
        hasOk
        okText="保存"
        onOk={ this.saveSecuritySetting }
      >
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6} bsClass="safe-control">
            <div className="sc-label">白名单：</div>
            <div className="sc-ip-col">
                {
                    this.state.whiteList.map(( index )=>{
                        return <div className="sc-ip-row" key={'wl-'+index}>
                                    <FormControl ref={PREFIX_WHITE_LIST_FROM+index} placeholder="0.0.0.0"/>
                                    -
                                    <FormControl ref={PREFIX_WHITE_LIST_TO+index} placeholder="0.0.0.0"/>
                                    <Button className="ghost-btn no-border" onClick={this.addWhiteList}>
                                        <i className="fa fa-plus"></i>
                                    </Button>
                                    <Button className="ghost-btn no-border" data-index={index} onClick={this.removeWhiteList}>
                                        <i className="fa fa-minus"></i>
                                    </Button>
                                </div>
                    })
                }
            </div>
          </Col>
          <Col componentClass={ControlLabel} sm={6} bsClass="safe-control">
            <div className="sc-label">黑名单：</div>
            <div className="sc-ip-col">
                {
                    this.state.blackList.map(( index )=>{
                        return <div className="sc-ip-row" key={'bl-'+index}>
                                    <FormControl ref={PREFIX_BLACK_LIST_FROM+index} placeholder="0.0.0.0"/>
                                    -
                                    <FormControl ref={PREFIX_BLACK_LIST_TO+index} placeholder="0.0.0.0"/>
                                    <Button className="ghost-btn no-border" onClick={this.addBlackList}>
                                        <i className="fa fa-plus"></i>
                                    </Button>
                                    <Button className="ghost-btn no-border" data-index={index} onClick={this.removeBlackList}>
                                        <i className="fa fa-minus"></i>
                                    </Button>
                                </div>
                    })
                }
            </div>
          </Col>
      </FormGroup>
      </Modal>
    )
  }
}

export default SecuritySettingPopup;