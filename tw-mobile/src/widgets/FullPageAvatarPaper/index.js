import React from 'react';
import Avatar from 'material-ui/Avatar';
import { FullPagePaper } from 'widgets/FullPagePaper';
import Paper from 'material-ui/Paper';
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';

let avatarStyle = {
  display: 'block',
  overflow: 'hidden',
  borderRadius: '50%',
  position: 'relative',
  width: pxToRem( 144 ),
  height: pxToRem(144),
  margin: '-'+pxToRem( 115 )+' auto '+pxToRem( 32 )+' auto'
}

let imgStyle = {
  top: '50%',
  width: '100%',
  position: 'absolute',
  transform: 'translateY(-50%)',
}

let fullPagePaperStyle = {
  paddingTop: pxToRem( 92 ),
  background: 'linear-gradient(45deg,#67cBEC,#2686ff)'
}

let headTextStyle = {
  textAlign: 'center',
  color: '#b7b7b7',
  fontSize: fontSizeByDPR( 24 ),
  height: pxToRem( 33 ),
  lineHeight: pxToRem( 33 )
}
/*
propTypes = {
  avatarSrc: React.PropTypes.string,
  headText: React.PropTypes.string
}
*/
export class FullPageAvatarPaper extends React.PureComponent {

  render() {
    let {
      avatarSrc,
      headText
    } = this.props;
    return (
      <FullPagePaper style={ fullPagePaperStyle }>
        {/* <Avatar
          src={ avatarSrc }
          style={ avatarStyle }
        /> */}
        <div style={avatarStyle}>
          <img src={avatarSrc} style={imgStyle}/>
        </div>
        <h2 style={ headTextStyle }>{ headText }</h2>
        <div>
          {this.props.children}
        </div>
      </FullPagePaper>
    );
  }
} 