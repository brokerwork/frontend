import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { getType } from '@/utils/language'
import { USER_INFO, ls } from '@/utils/storage'
import * as actions from '@/actions/Viewpoint/viewpoint'
import * as commonActions from '@/actions/Common/common'
import './robot.less'

export const languages = { 'zh-CN': 'cs', 'en-US': 'en', 'zh-TW': 'ct', 'ja-JP': 'ja', 'ko-KR': 'en'}
class Robot extends Component {
    constructor() { 
        super()
        this.state = {
            userInfo: ls.getItem(USER_INFO) || {},
            flag: false,
        }
    }
    componentDidMount() { 
        if (this.props.brandInfo && this.props.brandInfo.opinionId) { 
            this.props.checkToken().then(res => { 
                if (res && res.result) { 
                    let time = moment(res.time).utcOffset(0).format('YYYYMMDDHHmmss')
                    let lang = languages[getType()]
                    this.props.encrypt({
                        encryptKey: `page=${this.props.brandInfo.opinionId}&usi=${this.state.userInfo.userId}&aci=${time}&lang=${lang}`,
                    })
                }
            })
        }
    }
    componentWillReceiveProps(nextProps) { 
        if (!this.state.flag) { 
            if (nextProps.brandInfo) { 
                this.setState({
                    flag: true,
                })
                this.props.checkToken().then(res => { 
                    if (res && res.result) { 
                        let time = moment(res.time).utcOffset(0).format('YYYYMMDDHHmmss')
                        let lang = languages[getType()]
                        this.props.encrypt({
                            encryptKey: `page=${this.props.brandInfo.opinionId}&usi=${this.state.userInfo.userId}&aci=${time}&lang=${lang}`,
                        })
                    }
                })
            }
        }
    }
    render() {
        return (
            <div className='page iframe-container'>
                <iframe width='100%' height='100%' src={`https://site.recognia.com/${this.props.brandInfo.tcPath}/serve.shtml?tkn=${this.props.tkn}`} frameborder="0"></iframe>
            </div>
        )
    }
}

export default connect(
    ({ common, viewpoint }) => { 
        return {
            tkn: viewpoint.tkn,
            brandInfo: common.brandInfo,
        }
    }, {
        ...actions,
        ...commonActions,
    }
)(Robot)