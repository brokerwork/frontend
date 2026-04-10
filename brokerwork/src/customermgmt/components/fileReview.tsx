// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
/* ------------------- main start ---------------------- */

interface P {
  url?:string
}

let instance:any;
let wrapper = document.createElement( 'div' );
document.body.appendChild( wrapper );

function close() {
  if ( instance ) {
    ReactDOM.unmountComponentAtNode( wrapper );
  }
}

let frStyle = {
  position: 'fixed',
  top: '25px',
  right: '100px',
  bottom: '25px',
  left: '100px',
  zIndex: '9999'
}
let pHeader = {
  backgroundColor: 'black !important',
  borderColor: 'black !important'
}
let pBody = {
  position: 'absolute',
  top: '48px',
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'black'
}
let imgStyle = {
  margin: '0 auto',
  display: 'block',
  height: '100%'
}

class FileReview extends React.Component<P,{}> {
  constructor( props:P ) {
    super( props );
  }

  render() {
    return (
      <div className="panel" style={frStyle}>
        <div className="panel-heading" style={pHeader}>
          <span className="tools pull-right">
            <a onClick={ close } className="fa fa-times" style={{cursor: 'pointer', color:'white'}}/>
          </span>
        </div>
        <div className="panel-body" style={pBody}>
          <img src={this.props.url} style={imgStyle}/>
        </div>
      </div>
    )
  }
}

export let Reviewer = {
  show( url:string ) {
    close();
    instance = ReactDOM.render( <FileReview url={url}/>, wrapper );
  }
}

