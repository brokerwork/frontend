import React from 'react';
import Snackbar from 'material-ui/Snackbar';

import css from './index.less';

let style = {
    bottom: "50%",
    transform: "none",
    marginLeft: "-1.4866rem"
}

let contentStyle = {
    color: "#fff" 
}

let bodyStyle = {
    height: "2.9733rem",
    width: "2.9733rem",
    lineHeight: "1.2rem",
    borderRadius: "0.1066rem",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "10px 18px",
    textAlign: "center"
}

export class SnackBar extends React.Component {

    static defaultProps = {
        message: '',
        style: style,
        contentStyle: contentStyle,
        bodyStyle: bodyStyle,
        autoHideDuration: 2000,
        className: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open ? this.props.open : false,
            autoHideDuration: this.props.autoHideDuration ? this.props.autoHideDuration : 2000
        };
    }

    onShow = () => {
        this.setState({
            open: true
        })
    }

    _onRequestClose = () => {
        this.setState({
            open: false
        }, ()=>{
            this.props.close && this.props.close();
        })
    }

    render() {
        let p = this.props;
        let d = SnackBar.defaultProps;
        let style = p.style ? Object.assign( {} , p.style , d.style ) : d.style;
        let contentStyle = p.contentStyle ? Object.assign( {} , p.contentStyle , d.contentStyle) : d.contentStyle;
        let bodyStyle = p.bodyStyle ? Object.assign( {} , p.bodyStyle , d.bodyStyle ) : d.bodyStyle;

        return (
            <Snackbar
              className={this.props.className}                
              open={this.state.open}
              message={this.props.message}
              autoHideDuration={this.state.autoHideDuration}
              style={style}
              contentStyle={contentStyle}
              bodyStyle={bodyStyle}
              onRequestClose={this._onRequestClose}
            />
        )
    }
}

SnackBar.propTypes = {
    className: React.PropTypes.string,
    autoHideDuration: React.PropTypes.number,
    open: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    style: React.PropTypes.object,
    contentStyle: React.PropTypes.object,
    bodyStyle: React.PropTypes.object,
    message: React.PropTypes.node
}