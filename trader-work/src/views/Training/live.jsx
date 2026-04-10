import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'

import * as liveAction from '@/actions/Training/live'
import * as appAction from '@/actions/App/app'
import i18n from '@/utils/i18n'
import './live.less'
import zb from '@/images/zb-default.png'

class Live extends Component {
    constructor() { 
        super()
        this.state = {
            page: 1,
            size: 9,
        }
    }

    componentDidMount() {
        const { setHeaderTitle, resetLiveVideoList, getLiveVideoList } = this.props
        setHeaderTitle(i18n['training.vod.all.videos'])
        resetLiveVideoList()
        getLiveVideoList(this.state.page, this.state.size)
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['training.vod.all.videos'])
    }
    toLiving = (id) => {
        this.props.history.push(`/training/live/${id}`)
    }

    loadMore = () => { 
        const { getLiveVideoList } = this.props
        getLiveVideoList(++this.state.page, this.state.size)
    }

    render() {
        const { liveVideoList } = this.props
        return (
            <div className="live-container">
                {
                    liveVideoList && liveVideoList.list.length ? <div className="live-list">
                        {
                            liveVideoList.list.map((item, index) => { 
                                return <div onClick={this.toLiving.bind(this, item.id)} className="live-li">
                                    <div className="li-img">
                                        {
                                            item.state == 'STARTED' && <span className="li-hint-time li-started">{i18n['mobile.living.key']}</span>
                                        }    
                                        {
                                            item.state == 'NOTSTART' && <span className="li-hint-time li-not-started">{i18n['mobile.not.live.key']}</span>
                                        }
                                        <img className="li-cover-img" src={item.cover} />
                                        <div className="li-cover">
                                            <span className="iconfont icon-bofang"></span>
                                        </div>
                                    </div>
                                    <div className="li-des">
                                        <p className="li-des-tit">{item.subject}</p>
                                        <p className="li-des-teacher">{i18n['training.live.lecture']}: {item.lecturerName}</p>
                                    </div>
                                </div>
                            })
                        }
                        <div className="clear"></div>
                        {
                            liveVideoList.total > liveVideoList.pager * liveVideoList.size
                            &&
                            <Button onClick={this.loadMore} className="tw-btn-primary live-btn">{i18n['training.loadmore']}</Button>                        
                        }
                        </div> : <div className="live-empty">
                            <div className="live-empty-img">
                                <img src={zb} />
                            </div>
                            <p className="live-empty-hint">{i18n['training.live.empty.broadcasts']}</p>
                        </div>
                }   
            </div>
        )
    }
}

export default connect(
    ({ app, training }) => { 
        return {
            liveVideoList: training.liveVideoList,
        }
    }, {
        ...liveAction,
        ...appAction,
    }
)(Live)