import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import RaisedButton from 'material-ui/RaisedButton'

import { pxToRem } from 'utils/styleUtils'

import css from './index.less'

let btnHeight = pxToRem(98)

class AgreePopup extends Component {
    constructor() { 
        super()
        this.state = {
            isShow: false
        }
    }

    componentDidMount() {
        
    }
    componentWillReceiveProps(newProps) { 
        if (newProps.show) {
            setTimeout(() => {
                this.setState({
                    isShow: true
                })
            }, 0)
        } else { 
            this.setState({
                isShow: false
            })
        }
    }
    
    render() {
        const { title, onClose } = this.props
        let topStyle = this.state.isShow ? { top: 0 } : {}
        return (
            <div>
                {
                    this.props.show && <div className={css['agree-popup-wrap']}>
                        <div style={topStyle} className={css["tw-mobile-modal-body"]}>
                            <div className={css["tw-mobile-modal-head"]}>
                                <span className={css["title"]}>{this.props.title}</span>
                            </div>
                            <div className={css["tw-mobile-modal-content"]}>{this.props.children}</div>
                            <div className={css["tw-mobile-modal-footer"]}>
                                <RaisedButton
                                    fullWidth
                                    primary={true}
                                    buttonStyle={{ height: btnHeight }}
                                    label="知道了"
                                    onClick={() => { onClose() }} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default AgreePopup