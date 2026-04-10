import React from 'react';

//	components
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper';
import { ApplicationNavigation } from 'widgets/ApplicationNavigation';
import { Player } from 'widgets/Player';
import { CastDescription } from 'widgets/CastDescription';
import { IScrollView } from 'widgets/IScrollView';
import { VideoItem } from "widgets/VideoItem";
import i18n from 'utils/i18n';

//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { Storage } from 'utils/storage';
import { post, get } from 'utils/api';
import { getCachedToken } from 'utils/userinfo';
import cs from './index.less';

let iScrollViewStyle = {
	flex: 1,
	display: 'flex'
}

export class VideoSinglePage extends React.Component {
	static contextTypes = {
		router: React.PropTypes.object
	}
	constructor(props) {
		super(props);
		this.state = {
			size: 5,
			page: 1,
			pages: 1,
			videoIndex: this.props.params.index * 1,
			album: null,
			currentVideoDetail: null
		};
	}

	componentWillMount() {

	}

	componentWillReceiveProps(newProps) {
		let newIndex = newProps.params.index;
		let oldIndex = this.props.params.index;
		if (newIndex !== oldIndex) {
			this._init()
		}
	}

	_init = () => {
		let page = this._parsePage();
		this.setState({
			page: page
		}, () => {
			this._fetchAlbum(res => {
				if (res && res.result) {
					let currentVideoDetail = null
					res.data.list.forEach((item) => { 
						if (this.state.videoIndex === item.index * 1) { 
							currentVideoDetail = item
						}
					})
					this.setState({
						currentVideoDetail: currentVideoDetail,
						album: res.data,
						pages: res.data.pages
					})
				}
			})
		})
	}

	componentDidMount() {
		this._init()
	}

	_parsePage = () => {
		let size = this.state.size;
		let index = this.state.videoIndex + 1;
		let page;
		if ((index % size) === 0) {
			page = index / size
		} else {
			page = parseInt(index / size) + 1
		}
		return page;
	}

	_fetchAlbum = (callback) => {
		let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let options = {
			headers: {
				'x-api-account-token': accountToken,
				'x-api-token': getCachedToken()
			}
		}
		let id = this.props.params.id;
		let url = `/api/v1/video/replay/video_list?id=${id}&page=${this.state.page}&size=${this.state.size}`;
		get(url, options).then(res => {
			callback && callback(res)
		})
	}


	handleTouchTap = (videoIndex) => {
		let id = this.props.params.id;
		this.setState({
			videoIndex: videoIndex
		}, () => {
			this.context.router.push(`/albumpage/${id}/${videoIndex}`)
		})
	}

	handleScrollBottom = () => {
		let nextPage = this.state.page * 1 + 1;
		if (nextPage > this.state.pages) {
			return
		}
		this.setState({
			page: nextPage
		}, () => {
			this._fetchAlbum(res => {
				if (res && res.result) {
					this.setState({
						album: res.data,
						pages: res.data.pages
					})
				}
			})
		})
	}

	handleScrollTop = () => {
		let prevPage = this.state.page * 1 - 1;
		if (prevPage < 1) {
			return
		}
		this.setState({
			page: prevPage
		}, () => {
			this._fetchAlbum(res => {
				if (res && res.result) {
					this.setState({
						album: res.data,
						pages: res.data.pages
					})
				}
			})
		})
	}

	render() {
		let { currentVideoDetail, album } = this.state;
		return (
			<Page>
				<PageContent bgColor={"#fff"}>
					<div className={cs['flexbox']}>
						<div id={"videoPlayerPage_fixed_area"}>
							<Player
								cover={currentVideoDetail && currentVideoDetail.coverUrl}
								pullUrl={currentVideoDetail && currentVideoDetail.replayUrl} />
							<CastDescription
								currentVideoName={currentVideoDetail && currentVideoDetail.replayName}
								subject={album && album.subject}
								description={album && album.description}
								type={"videoPage"} />
						</div>
						<div style={iScrollViewStyle}>
							<IScrollView
								onScrollBottom={this.handleScrollBottom}
								onScrollTop={this.handleScrollTop}>
								{
									album && album.list && album.list.map((item, index) => {
										let { cover, subject } = album;
										return (
											<VideoItem
												cover={cover}
												subject={subject}
												replayName={item.replayName}
												type={"videoList"}
												onTouchTap={() => { this.handleTouchTap(item.index * 1) }}
												key={index} />
										)
									})
								}
							</IScrollView>
						</div>
					</div>
				</PageContent>
				<PageFooter>
					<ApplicationNavigation defaultSelectedIndex={1} />
				</PageFooter>
			</Page>

		)
	}
}