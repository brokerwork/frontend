import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TcPlayer } from '@/utils/TcPlayer'
import * as vodAction from '@/actions/Training/vod'
import * as appAction from '@/actions/App/app'
import * as commonActions from '@/actions/Common/common'
import i18n from '@/utils/i18n'
import './vodList.less'

class VodList extends Component {
    tokenTime = 300000

    constructor() { 
        super()
        this.state = {
            videoInfo: {}
        }
    }

    //  腾讯云播放器配置
    setPlayerConfig = (list) => { 
        let errTip = i18n['training.vod.error']
        let options = {
            "m3u8": list.replayUrl,
            "flv": list.replayUrl.replace('m3u8', 'flv'),
            "coverpic": list.coverUrl,
            "live": false,
            "autoplay": true,
            "width": '100%',
            "height": '100%',
            "wording": {
                1: errTip,
                2: errTip,
                3: errTip,
                4: errTip,
                5: errTip,
                10: errTip,
                11: errTip,
                12: errTip,
                13: errTip,
                1001: errTip,
                1002: errTip,
                2032: errTip,
                2048: errTip,
            }
        }
        let wrap = document.getElementById('id-video-wrap')
        wrap.innerHTML = ''
        new TcPlayer('id-video-wrap', options)
    }

    playVideo = (listItem) => { 
        this.setPlayerConfig(listItem)
        this.setState({
            videoInfo: listItem
        })
    }

    //  点播
    toMenuVod = () => { 
        this.props.history.replace('/training/vod')
    }

    //  离开组件清除拉取评论定时器
    componentWillUnmount() {
        clearTimeout(this.tokenTimer)
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['training.vod.all.videos'])
    }
    componentDidMount() { 
        const { resetVideoList, getVideoList, setHeaderTitle, match } = this.props
        setHeaderTitle(i18n['training.vod.all.videos'])
        resetVideoList()
        this.repeatRefreshToken()
        getVideoList(1, 10, match.params.videoId).then((res) => { 
            if (res && res.data && res.data.list){ 
                this.setPlayerConfig(res.data.list[0])
                this.setState({
                    videoInfo: res.data.list[0]
                })
            }
        })
    }

    //  刷新token
    repeatRefreshToken = () => { 
        const { refreshToken } = this.props
        refreshToken().then((res) => {
            this.tokenTimer = setTimeout(() => { 
                this.repeatRefreshToken()
            }, this.tokenTime)
        }).catch((err) => { 
            setTimeout(() => { 
                this.repeatRefreshToken()
            }, this.tokenTime)
        })
    }

    render() {
        const { videoList, match } = this.props
        let { videoInfo } = this.state
        return (
            <div className="vodlist-container">
                <div className="webcast-wrap">
                    <div className="webcast-tit">
                        <span onClick={this.toMenuVod} className="tit-menu-vod">{i18n['menu.vod']}</span>
                        <span className="iconfont icon-youjian webcast-right"></span>
                        <span>{videoInfo.replayName}</span>
                    </div>
                    <div className="webcast-content">
                        <div className="webcast-video">
                            <div className="video-wrap">
                                <div id="id-video-wrap"></div>
                                {
                                    videoInfo.replayUrl ? null : <div className="cover-webcast">
                                        <div>
                                            <p>{i18n['webcast.error.outservice']}</p>  
                                        </div>  
                                    </div>
                                }
                            </div>
                            <div className="video-tit">
                                <div className="video-tit-item">
                                    <span className="video-tit-name">{videoInfo.replayName}</span>
                                </div>
                                <p className="video-special"><span>{i18n['training.live.album']}: </span>{videoList && videoList.subject}</p>
                                {/* <p className="video-watch"><span>{i18n['training.vod.people.seen']}: </span>{i18n['training.vod.people.seen.suffix']}</p> */}
                            </div>
                            <div className="video-des">
                                {videoList && videoList.description}
                            </div>
                        </div>
                        <div className="webcast-comment">
                            <div className="comment-tit">{i18n['training.vod.playlist']}</div>
                            <div className="video-list">
                                {
                                    videoList && videoList.list && videoList.list.length ? videoList.list.map((item, index) => {
                                        return <div className="video-li" onClick={this.playVideo.bind(this, item)}>
                                            <div className="video-li-img">
                                                <img src={item.coverUrl} />
                                            </div>
                                            <div className="video-li-des">
                                                {item.replayName}
                                            </div>
                                        </div>
                                    }): null
                                }    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    ({ app, training }) => { 
        return {
            videoList: training.videoList
        }
    }, {
        ...vodAction,
        ...appAction,
        ...commonActions,
    }
)(VodList)