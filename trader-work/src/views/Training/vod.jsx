import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import moment from 'moment'

import Message from '@/components/Message'
import * as vodAction from '@/actions/Training/vod'
import * as appAction from '@/actions/App/app'
import i18n from '@/utils/i18n'
import './vod.less'
import zb from '@/images/zb-default.png'

class Vod extends Component {
    constructor() { 
        super()
        this.state = {
            page: 1,
            size: 9,
        }
    }

    componentDidMount() { 
        const { resetVideoReplay, getVideoReplay, setHeaderTitle } = this.props
        setHeaderTitle(i18n['training.vod.all.videos'])
        resetVideoReplay()
        getVideoReplay(this.state.page, this.state.size)
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['training.vod.all.videos'])
    }
    toList = (item) => {
        if (!item.replayListSize || item.replayListSize <= 0) { 
            return Message['warning'](i18n['training.vod.empty.list'])
        }
        this.props.history.push(`/training/vod/${item.id}`)
    }

    loadMore = () => { 
        const { getVideoReplay } = this.props
        getVideoReplay(++this.state.page, this.state.size)
    }
    render() {
        const { videoReplay } = this.props
        return (
            <div className="vod-container">
                {
                    videoReplay && videoReplay.list && videoReplay.list.length ? <div className="live-list">
                        {
                            videoReplay.list.map((item, index) => {
                                return <div className="live-li" onClick={this.toList.bind(this, item)}>
                                    <div className="li-img">
                                        <img src={item.cover} className="img"/>
                                        <span className="li-tips">{i18n['general.pagination.total']}{item.replayListSize ? item.replayListSize : 0}{i18n['mobile.video.a.key']}</span>
                                    </div>
                                    <div className="li-des">
                                        <p className="li-des-tit">{item.subject}</p>
                                        <p className="li-des-teacher">{i18n['training.live.lecture']}: {item.lecturerName}</p>
                                        <p className="li-des-update">{i18n['training.vod.update']}: {moment.unix(item.modifyTime).format('YYYY/MM/DD HH:ss')}</p>
                                    </div>
                                </div>
                            })
                        }
                        <div className="clear"></div>
                        {
                            videoReplay.total > videoReplay.pager * videoReplay.size
                            &&
                            <Button onClick={this.loadMore} className="tw-btn-primary live-btn">{i18n['training.loadmore']}</Button>
                        }
                    </div> : <div className="live-empty">
                        <div className="live-empty-img">
                            <img src={zb} />
                        </div>
                        <p className="live-empty-hint">{i18n['training.vod.empty.videos']}</p>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    ({ app, training }) => { 
        return {
            videoReplay: training.videoReplay
        }
    }, {
        ...vodAction,
        ...appAction,
    }
)(Vod)