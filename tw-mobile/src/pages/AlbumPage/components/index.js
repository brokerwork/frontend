import React from 'react';

//	components
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper';
import { ApplicationNavigation } from 'widgets/ApplicationNavigation';
import { CastDescription } from 'widgets/CastDescription';
import { IScrollView } from 'widgets/IScrollView';
import { VideoItem } from "widgets/VideoItem";
import i18n from 'utils/i18n'

//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import { Storage } from 'utils/storage';
import { post, get } from 'utils/api';
import { getCachedToken } from 'utils/userinfo';
import cs from './index.less';


let coverStyle = {
	width: '100%',
	height: pxToRem(280),
	position: "relative"
}

let markStyle = {
	width: pxToRem(80),
	height: pxToRem(37),
	lineHeight: pxToRem(37),
	textAlign: `center`,
	fontSize: fontSizeByDPR(26),
	backgroundColor: '#00a3fe',
	borderRadius: '5px 0 0 5px',
	color: "#fff",
	padding: "0 5px",
	position: "absolute",
	right: "0",
	bottom: pxToRem(25)
}
let iscrollViewWrapperStyle = {
	flex: 1,
	overflow: 'hidden',
	display: 'flex'
}
export class AlbumPage extends React.Component {

	static contextTypes = {
		router: React.PropTypes.object
	}

	constructor(props) {
		super(props);
		this.times = 1;
		this.baseSize = 5;
		this.state = {
			size: 5,
			album: null,
			total: 1
		};
	}

	componentDidMount() {
		this._fetchAlbum();
	}

	handleScrollBottom = () => {
		//	考虑到移动端是下滑加载数据，和pc端分页显示有区别，所以请求数据只变化size参数而不改变page参数
		if (this.state.size >= this.state.total) {
			return;
		}
		++this.times;
		//console.log("---size----", this.baseSize * this.times)
		this.setState({
			size: this.baseSize * this.times
		}, () => {
			this._fetchAlbum()
		})
	}

	_fetchAlbum = () => {
		let accountToken = Storage.getString(Storage.Keys.ACCOUNT_TOKEN);
		let options = {
			headers: {
				'x-api-account-token': accountToken,
				'x-api-token': getCachedToken()
			}
		}
		let id = this.props.params.id;
		let url = `/api/v1/video/replay/video_list?id=${id}&page=1&size=${this.state.size}`;
		get(url, options).then(res => {
			//console.log("res---", res);
			if (res.result && res.data) {
				this.setState({
					album: res.data,
					total: res.data.total
				})
			}
		})
	}

	handleTouchTap = (videoIndex) => {
		this.context.router.push(`/albumpage/${this.props.params.id}/${videoIndex}`)
	}

	render() {
		let album = this.state.album;
		return (
			<Page>
				<PageContent bgColor={"#fff"}>
					<div className={cs['flexbox']}>
						<div style={coverStyle} id={"album_page_cover"}>
							<img src={album && album.cover} width={"100%"} height={"100%"} />
							<span style={markStyle}>{i18n['training.live.album']}</span>
						</div>
						<CastDescription
							id={"album_page_description"}
							type={"albumPage"}
							subject={album && album.subject}
							description={album && album.description}
							numberOfVideo={album && album.total} />
						<div style={iscrollViewWrapperStyle}>
							<IScrollView
								onScrollBottom={this.handleScrollBottom}>
								{
									album && album.list && album.list.map((item, index) => {
										let { cover, subject } = album;
										return (
											<VideoItem
												cover={cover}
												subject={subject}
												replayName={item.replayName}
												type={"videoList"}
												onTouchTap={() => { this.handleTouchTap(item.index) }}
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

AlbumPage.propTypes = {
	subject: React.PropTypes.string,
	lecturerName: React.PropTypes.string
}