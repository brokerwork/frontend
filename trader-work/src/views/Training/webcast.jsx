import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Input, Button, Popconfirm, Modal } from 'antd'

import message from '@/components/Message'
import { TcPlayer } from '@/utils/TcPlayer'
import { ls, TOKEN, USER_INFO } from '@/utils/storage'
import * as liveAction from '@/actions/Training/live'
import * as appAction from '@/actions/App/app'
import * as commonActions from '@/actions/Common/common'
import i18n from '@/utils/i18n'
import './webcast.less'

import livePort from '@/images/live_port.png'

const { TextArea } = Input

class Webcast extends Component {
    index = null                                   //  从第几条评论开始拉取
    commentTime = 2000                             //  轮循取评论间隔
    tokenTime = 300000
    commentTimer = null                            //  轮循定时器
    commentCount = 20                              //  一次性拉回评论数量
    pushTime = 100                                 //  历史评论展示速度
    sendTime = 10                                  //  评论间隔时间
    isSend = false                                 //  是否发送过评论
    pushFlag = false                               //  循环赋值标记
    sendFlag = false                               //  是否允许发送评论
    isToBottom = false                             //  评论区滚动条是否应该滚动到底部
    constructor(props) {
        super(props)
        
        this.state = {
            userInfo: ls.getItem(USER_INFO) || {},      //  用户信息
            userState: {},                              //  用户状态
            sendContent: '',                            //  评论内容
            liveId: props.match.params.videoId,         //  直播ID
            webcastDes: {},                             //  直播详情
            cacheCommentArray: [],                      //  轮巡取回的所有评论
            commentArray: [],                           //  展示在评论区的评论
            visibleModal: false,                        //  游客限时提醒
            isBan: false                                //  是否被禁言本地状态
        }
    }

    //  离开组件清除拉取评论定时器
    componentWillUnmount() { 
        clearTimeout(this.commentTimer)
        clearTimeout(this.tokenTimer)
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['training.vod.all.videos'])
    }
    componentDidMount() {
        const {
            setHeaderTitle,
            visitGetLiveWebcast,
            getLiveWebcast,
            isLogin,
            getCommentList,
            getWebcastUserInfo,
        } = this.props
        const { liveId, userInfo } = this.state
        setHeaderTitle(i18n['training.vod.all.videos'])
        this.cacheCommentArray = []
        this.repeatGetCommentList()
        let playTime = 0
        //  游客
        if (!localStorage.getItem(TOKEN) || !isLogin) {
            visitGetLiveWebcast(liveId).then((res) => { 
                this.setWebcastInfo(res)
                if (res && res.result && res.data.state == 'STARTED') { 
                    playTime = res.data.expire - res.data.time
                    if (playTime <= 0) {
                        this.setState({
                            visibleModal: true
                        })
                        let wrap = document.getElementById('id-webcast-wrap')
                        wrap.innerHTML = ''
                    } else { 
                        //  游客观看直播倒计时
                        let downTimer = setInterval(() => { 
                            playTime--
                            if (playTime <= 0) { 
                                clearInterval(downTimer)
                                this.setState({
                                    visibleModal: true
                                })
                                let wrap = document.getElementById('id-webcast-wrap')
                                wrap.innerHTML = ''
                            }
                        }, 1000)
                    }
                }
            })
        } else { 
            //  普通用户
            this.repeatRefreshToken()
            getLiveWebcast(liveId).then((res) => {
                this.setWebcastInfo(res)
            })
            //  获取用户观看直播状态
            getWebcastUserInfo({
                userId: userInfo.userId,
                liveId: liveId,
            }).then((res) => { 
                if (res && res.result) { 
                    this.setState({
                        userState: res.data
                    })
                }
            })
        }
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

    //  循环拉取评论
    repeatGetCommentList = () => {
        const { getCommentList } = this.props
        let { liveId, userInfo } = this.state
        getCommentList({ liveId: liveId, index: this.index, count: this.commentCount }).then((res) => {
            if (res && res.result) { 
                let comments = res.data.comments
                if (this.index || this.isSend) { 
                    //  除了第一次返回的评论 都要去除自己发表的评论
                    comments = comments.filter((item) => { 
                        return item.userId != userInfo.userId
                    })
                }
                this.cacheCommentArray = this.cacheCommentArray.concat(comments)
                if (this.cacheCommentArray.length) { 
                    this.copyToComment()
                }
            }
            this.commentTimer = setTimeout(() => {
                if (res && res.result && res.data.comments.length) { 
                    this.index = res.data.comments[res.data.comments.length - 1].index
                }
                this.repeatGetCommentList()
            }, this.commentTime)
        }).catch((err) => {
            setTimeout(() => { 
                this.repeatGetCommentList()
            }, this.commentTime)
        })
    }

    //  循环赋值给评论区
    copyToComment = () => { 
        if (this.pushFlag) return false
        this.pushFlag = true
        let copyTimer = setInterval(() => {
            if (this.cacheCommentArray.length) {
                this.isToBottom = this.isScrollBottom()
                this.setState({
                    commentArray: [
                        ...this.state.commentArray,
                        this.cacheCommentArray.shift(),
                    ]
                }, () => { 
                    this.scrollToBottom()
                })
            } else {
                this.pushFlag = false
                clearInterval(copyTimer)
            }
        }, this.pushTime)
    }

    //  腾讯云直播配置
    setPlayerConfig = (item) => { 
        let options = {
            "m3u8": item.pullUrl,
            "flv": item.pullUrl.replace('m3u8', 'flv'),
            "coverpic": { style: 'cover', src: item.cover },
            "live": true,
            "autoplay": true,
            "width": '100%',
            "height": '100%',
            "wording": {
                1: this.errTip,
                2: this.errTip,
                3: this.errTip,
                4: this.errTip,
                5: this.errTip,
                10: this.errTip,
                11: this.errTip,
                12: this.errTip,
                13: this.errTip,
                1001: this.errTip,
                1002: this.errTip,
                2032: this.errTip,
                2048: this.errTip,
            }
        }
        //  非chrome浏览器优先使用H5播放器
        if (navigator.userAgent.indexOf('Chrome') == -1) { 
            options = {
                ...options,
                flash: false,
            }
        }
        let wrap = document.getElementById('id-webcast-wrap')
        wrap.innerHTML = ''
        new TcPlayer('id-webcast-wrap', options, {
            playStatus: (status, type) => {
                if (status == 'playEnd' || status == 'error') {
                    this.setState({
                        webcastDes: {
                            ...this.state.webcastDes,
                            state: 'FINISHED',
                        }
                    })
                }
            }
        })
    }



    //  赋值直播详情
    setWebcastInfo = (res) => { 
        if (res && res.result) {
            switch (res.data.state) { 
                case "STARTED":
                    this.errTip = i18n['webcast.error.started']
                    break;
                case "NOTSTART":
                    this.errTip = i18n['webcast.error.nostart']
                    break;
                default: 
                    this.errTip = i18n['webcast.error.finished']    
            }
            this.setState({
                webcastDes: res.data
            })
            this.setPlayerConfig(res.data)
        }
    }

    //  评论输入框
    inputChange = (event) => { 
        this.setState({
            sendContent: event.target.value
        })
    }

    //  发送评论
    send = (event) => {
        event.preventDefault()
        if (this.sendFlag) { 
            return message['warning'](i18n['webcast.comment.often'])
        }
        const { sendComment } = this.props
        const { userInfo, userState, sendContent, liveId } = this.state
        if (!sendContent.trim()) { 
            return message['warning'](i18n['webcast.comment.not.empty'])
        }
        this.isToBottom = true
        this.setState({
            commentArray: [
                ...this.state.commentArray,
                {
                    timestamp: Date.now()/1000,
                    userName: userState.userName,
                    comment: sendContent,
                    userId: userInfo.userId,
                    index: null,
                }
            ]
        }, () => {
            this.scrollToBottom()
            this.setState({
                sendContent: ''
            })
            //  发送评论至服务器
            this.sendFlag = true
            sendComment({
                userId: userInfo.userId,
                liveId: liveId,
                comment: sendContent,
            }).then((res) => { 
                if (res && res.result) {
                    this.isSend = true
                    let timer = setInterval(() => {
                        this.sendTime--
                        if (this.sendTime <= 0) {
                            this.sendFlag = false
                            this.sendTime = 10
                            clearInterval(timer)
                        }
                    }, 1000)
                } else { 
                    this.sendFlag = false
                    if (res.mcode == 'TW_VIDEO_0000008') { 
                        this.setState({
                            isBan: true
                        })
                        this.refs.sendText.blur()
                    }
                }
            }, (err) => {
                this.sendFlag = false
            })
        })
    }

    //  删除评论
    delComment = (index) => { 
        const { deleteComment } = this.props
        deleteComment({
            liveId: this.state.liveId,
            index: index
        }).then((res) => { 
            if (res && res.result) { 
                message['success'](i18n['tausermgmt.successfully.delete'])
                //  删除本地评论
                this.setState({
                    commentArray: [
                        ...this.state.commentArray.filter((item) => {
                            return item.index != index
                        })
                    ]
                })
            }
        })
    }

    //  禁言用户
    banComment = (userId) => {
        const { isBanSendComment } = this.props
        isBanSendComment({
            userId: userId,
            liveId: this.state.liveId,
            disable: true,
        }).then((res) => { 
            if (res && res.result) {
                message['success'](i18n['webcast.ban.comment.suc'])
            }
        })
    }

    toLogin = () => { 
        this.props.history.push(`/login?redirect=${location.pathname}`)
    }
    //  浮层登录按钮
    renderButton = () => { 
        return <Button type="primary" onClick={this.toLogin}>{i18n['general.gotologin']}</Button>
    }

    //  评论区滚动条滚至底部
    scrollToBottom = () => { 
        if (!this.isToBottom) { 
            return false
        }
        let dom = this.refs.commentCenter
        dom.scrollTop = dom.scrollHeight - dom.clientHeight
    }
    isScrollBottom = () => { 
        let dom = this.refs.commentCenter
        return dom.scrollTop == dom.scrollHeight - dom.clientHeight
    }

    render() {
        const { webcastDes, sendContent, userState } = this.state
        const { isLogin } = this.props
        let wrapWidth = isLogin ? { width: '910px' } : { width: '1180px' }
        let videoWidth = isLogin ? { width: '590px' } : { width: '888px' }
        let videoSize = isLogin ? { width: '590px', height: '325px' } : { width: '888px', height: '500px' }
        return (
            <div className="webcast-container" id='webcast-con'>
                {
                    !isLogin && <div className="visit-tit">{i18n['training.live.all.broadcast']}</div>
                }
                <div className="webcast-wrap" style={wrapWidth}>
                    <div className="webcast-tit">
                        <Link to="/training/live" className="tit-menu-broadcast">{i18n['menu.broadcast']}</Link>
                        <span className="iconfont icon-youjian webcast-right"></span>
                        <span>{webcastDes.subject}</span>
                    </div>
                    <div className="webcast-content">
                        {/* 直播视频 */}    
                        <div className="webcast-video" style={videoWidth}>
                            <div className="video-wrap" style={videoSize}>
                                <div id="id-webcast-wrap"></div>
                                {
                                    webcastDes.state !== 'STARTED' && <div className="cover-webcast">
                                        {
                                            webcastDes.state === 'NOTSTART' && <div>
                                                <p>{i18n['webcast.not.start']}</p>  
                                                <p>{i18n['webcast.start.time']}{moment.unix(webcastDes.startTime).format('YYYY.MM.DD HH:mm')}</p>
                                            </div>   
                                        }    
                                        {
                                            webcastDes.state === 'FINISHED' && <div>
                                                <p>{i18n['webcast.finished']}</p>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <div className="video-tit">
                                <div className="video-tit-item">
                                    <span className="video-tit-name">{webcastDes.subject}</span>
                                    <div className="video-share" style={{display: 'none'}}>
                                        <span className="video-share-word">{i18n['training.live.share']}</span>
                                        <span className="iconfont icon-wechat wechat"></span>
                                        <span className="iconfont icon-weibo weibo"></span>
                                    </div>
                                </div>
                                <p className="video-special"><span>{i18n['training.live.album']}: </span>{webcastDes.subject}</p>
                                <p className="video-watch"><span>{i18n['training.vod.people.number']}: </span>{webcastDes.onlineCnt}</p>
                            </div>
                            <div className="video-des">
                                {webcastDes.description}
                            </div>
                        </div>
                        {/* 评论区 */}
                        <div className="webcast-comment">
                            <div className="comment-tit">{i18n['training.live.content']}</div>
                            <div className="comment-center" ref='commentCenter'>
                                {
                                    webcastDes.state === 'NOTSTART' && <div className="webcast-start-time">
                                        {i18n['webcast.start']}: {moment.unix(webcastDes.startTime).format('HH:mm:ss')}
                                    </div>
                                }
                                {
                                    this.state.commentArray.length ? <div className="comment-comment">
                                        {
                                            this.state.commentArray.length && this.state.commentArray.map((item, index) => {
                                                return <div key={index} className="comment-li">
                                                    <p className="li-tit">{moment.unix(item.timestamp).format('HH:mm:ss')}</p>
                                                    <div className="li-wrap">
                                                        <div className="li-comment">
                                                            <div id={`comment-${item.index}`} className="li-port-name">
                                                                <img className="li-port" src={item.port || livePort} /> 
                                                                <span className="li-name">{item.userName}</span>
                                                                {/* 管理员删除禁言 */}
                                                                {
                                                                    userState.isAdmin && item.index ? <span className="admin-control">
                                                                            <Popconfirm
                                                                                getPopupContainer={()=>document.getElementById(`comment-${item.index}`)}    
                                                                                title={i18n['webcast.confirm.delete.comment']}
                                                                                okText={i18n['tausermgmt.confirm']}
                                                                                cancelText={i18n['tausermgmt.cancel']}
                                                                                onConfirm={this.delComment.bind(this, item.index)}
                                                                                trigger="click">
                                                                                <a href="#" className="admin-delete admin-delete-ban">{i18n['tausermgmt.delete']}</a>
                                                                            </Popconfirm>      
                                                                            <Popconfirm
                                                                                getPopupContainer={()=>document.getElementById(`comment-${item.index}`)}    
                                                                                title={i18n['webcast.confirm.ban.user']}
                                                                                okText={i18n['tausermgmt.confirm']}
                                                                                cancelText={i18n['tausermgmt.cancel']}
                                                                                onConfirm={this.banComment.bind(this, item.userId)}
                                                                                trigger="click">
                                                                                <a href="#" className="admin-ban admin-delete-ban">{i18n['webcast.ban.comment']}</a>
                                                                            </Popconfirm>
                                                                        </span> : null
                                                                }
                                                            </div>
                                                            <div className="li-word">{item.comment}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }    
                                    </div> : <div className="comment-no">{i18n['webcast.no.comment']}~</div>
                                }    
                            </div>
                            <div className="comment-send">
                                {
                                    !isLogin && <p className="comment-login"><span onClick={this.toLogin}>{i18n['login.submit']}</span>{i18n['webcast.after.comment']}</p>
                                } 
                                {
                                    (userState.disable || this.state.isBan) && <p className="comment-login">{i18n['webcast.ban.comment.ring.up']}</p>
                                }
                                <TextArea
                                    autosize
                                    ref="sendText"
                                    value={sendContent}
                                    disabled={!isLogin || userState.disable} 
                                    onChange={this.inputChange}
                                    maxLength="200"
                                    onPressEnter={this.send} />
                                <Button disabled={!isLogin || userState.disable} className="tw-btn-primary" onClick={this.send}>{i18n['webcast.send.comment']}</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    title={i18n['webcast.hint.sweet']}
                    width='350px'
                    closable={false}
                    footer={this.renderButton()}
                    wrapClassName="vertical-center-modal"
                    visible={this.state.visibleModal}>
                    {i18n['webcast.login.look']}
                </Modal>
            </div>
        )
    }
}

export default connect(
    ({ common, app, training }) => { 
        return {
            isLogin: common.isLogin,
        }
    }, {
        ...liveAction,
        ...appAction,
        ...commonActions,
    }
)(Webcast)