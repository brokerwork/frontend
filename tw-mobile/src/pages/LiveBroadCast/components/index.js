import React from 'react';

//	components
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper';
import { Tabs, Tab } from 'material-ui/Tabs';
import { ApplicationNavigation } from 'widgets/ApplicationNavigation';
import { CastItem } from './CastItem/';
import { VideoItem } from "widgets/VideoItem";

//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { get } from 'utils/api';
import { getCachedToken } from 'utils/userinfo';
import { Storage } from 'utils/storage';
import { formatDate } from 'utils/formatDate';
import { IScrollView } from 'widgets/IScrollView';
import i18n from 'utils/i18n'


let tabItemContainerStyle = {
	background: "#fff",
	borderBottom: '1px solid #E0E0E0'
}

let buttonStyle = {
	color: "#939393",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}
let curButtonStyle = {
    color: "#00a3fe",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}

let inkBarStyle = {
	backgroundColor: "#00a3fe",
	boxShadow: "0 0 0.05rem rgba(0,0,0,0.2)"
}

let videoTabContentStyle = {
	marginTop: pxToRem(20),
	borderTop: "1px solid #e0e0e0",
}

let liveTabContentStyle = {
	marginTop: pxToRem(20),
	paddingBottom: pxToRem(105),
}

export class LiveBroadCast extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object
	}

	constructor(props) {
		super(props);
		this.onScrollEndFn = () => { };
		this.state = {
			currentTab: 'liveBroadCast',
			isVideoListInitail: false,
			videoList: [],
			videoTotal: Number.MAX_VALUE,
			videoPage: 1,
			videoSize: 10,
			videoTimes: 1,
			liveList: [],
			liveTotal: Number.MAX_VALUE,
			livePage: 1,
			liveSize: 10,
			liveTimes: 1,
			baseSize: 10
		}
	}

	componentWillMount() {
		this._fetchLiveList()
	}

	_onScrollBottom = () => {
		let self = this;
		let {
			baseSize,
			videoTimes,
			videoPage,
			videoPages,
			videoTotal,
			videoSize,
			liveTimes,
			liveTotal,
			livePage,
			liveSize,
			livePages } = this.state;
		if (self.state.currentTab === 'liveBroadCast') {
			if (liveSize > liveTotal) {
				return
			}
			let times = liveTimes + 1;
			let size = baseSize * times;
			self.setState({
				liveTimes: times,
				liveSize: size
			}, () => {
				self._fetchLiveList()
			})
		} else {
			if (videoSize > videoTotal) {
				return
			}
			let times = videoTimes + 1;
			let size = baseSize * times;
			self.setState({
				videoTimes: times,
				videoSize: size
			}, () => {
				self._fetchLiveList()
			})
		}
	}

	_fetchLiveList = () => {
		let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let options = {
			headers: {
				'x-api-account-token': accountToken,
				'x-api-token': getCachedToken()
			}
		}
		let { liveList, livePage, liveSize } = this.state;
		let url = `/api/v1/video/live/list?page=${livePage}&size=${liveSize}`;
		get(url, options).then(res => {
			if (res.result && res.data) {
				this.setState({
					liveList: res.data.list||[],
					liveTotal: res.data.total,
					liveSize: res.data.size
				})
			}
		})
	}

	_handleTabsChange = (value) => {
		this.setState({
			currentTab: value
		}, () => {
			if (value === 'video' && !this.state.isVideoListInitail) {
				this.setState({
					isVideoListInitail: true
				})
				this._fetchVideoList()
			}
		})
	}

	_fetchVideoList = () => {
		let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let options = {
			headers: {
				'x-api-account-token': accountToken,
				'x-api-token': getCachedToken()
			}
		}
		let { videoList, videoPage, videoSize } = this.state;
		let url = `/api/v1/video/replay/class_list?page=${videoPage}&size=${videoSize}`;
		get(url, options).then(res => {
			if (res.result && res.data) {
				this.setState({
					videoList: res.data.list||[],
					videoTotal: res.data.total,
					videoSize: res.data.size
				})
			}
		})
	}

	_handleVideoTouch = (id) => {
		this.context.router.push(`/albumpage/${id}`)
	}

	_handleLiveTouchTap = (id) => {
		this.context.router.push(`/livebroadcast/${id}`);
	}

	_parseLiveList = () => {
		//	如果直播的状态是finished不显示该直播
		const { liveList } = this.state
		return liveList && liveList.filter(item => {
			return item.state.toLowerCase() !== 'finished'
		})
	}

	render() {
		let filteredLiveList = this._parseLiveList()||[];
		return (
			<Page>
				<PageContent>
					<IScrollView onScrollBottom={this._onScrollBottom}>
						<Tabs
							tabItemContainerStyle={tabItemContainerStyle}
							inkBarStyle={inkBarStyle}
							onChange={this._handleTabsChange}
						>
							<Tab
								label={i18n['menu.broadcast']}
								value="liveBroadCast"
								style={{float:"left"}}
								buttonStyle={
									this.state.currentTab == 'liveBroadCast' ? curButtonStyle : buttonStyle
								} >
								<div style={liveTabContentStyle}>
									{
										filteredLiveList.length>0 ? filteredLiveList.map((item, index) => {
											return (
												<CastItem
													cover={item.cover}
													description={item.description}
													id={item.id}
													lecturerId={item.id}
													lecturerName={item.lecturerName}
													pullUrl={item.pullUrl}
													startTime={item.startTime}
													state={item.state}
													subject={item.subject}
													key={index}
													onTouchTap={() => this._handleLiveTouchTap(item.id)}
												/>
											)
										}):<div style={{textAlign:'center',color:'#939393',paddingTop:'10px'}}>{i18n['training.live.empty.broadcasts']}</div>
									}
								</div>
							</Tab>
							<Tab
								label={i18n['mobile.video.key']}
								value="video"
								style={{float:"right"}}
								buttonStyle={
									this.state.currentTab == 'video' ? curButtonStyle : buttonStyle
								} >
								<div style={videoTabContentStyle}>
									{
										this.state.videoList.length>0 ? this.state.videoList.map((item, index) => {
											let { mins, replayListSize, subject, modifyTime, cover } = item;
											return (
												<VideoItem
													type={"albumlist"}
													mins={mins}
													size={replayListSize}
													subject={subject}
													modifyTime={formatDate(modifyTime)}
													cover={cover}
													onTouchTap={() => { this._handleVideoTouch(item.id) }}
													key={index} />
											)
										}):<div style={{textAlign:'center',color:'#939393',paddingTop:'10px'}}>{i18n['training.vod.empty.videos']}</div>
									}
								</div>
							</Tab>
						</Tabs>
					</IScrollView>

				</PageContent>
				<PageFooter>
					<ApplicationNavigation defaultSelectedIndex={1} />
				</PageFooter>
			</Page>
		)
	}
}