import React from 'react'
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import { IconTextField } from 'widgets/IconTextField';
import { IconSelectField } from 'widgets/IconSelectField';
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper'
import { ApplicationNavigation } from 'widgets/ApplicationNavigation'
import { Player } from 'widgets/Player'
import { CastDescription } from 'widgets/CastDescription'
import { IScrollView } from 'widgets/IScrollView'
import { emailRegex, phoneRegex, pswdRegex } from 'utils/validator';
import { doLogin } from 'pages/Login/actions';
import moment from 'moment'
//	utils
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils'
import i18n from 'utils/i18n'
import css from './index.less'
import headerImg from 'images/default_header.png'
const tabItemContainerStyle = {
	background: "#fff",
	borderBottom: '1px solid #E0E0E0'
}
const buttonStyle = {
	color: "#939393",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}
const curButtonStyle = {
    color: "#00a3fe",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}
const inkBarStyle = {
	backgroundColor: "#00a3fe",
	boxShadow: "0 0 0.05rem rgba(0,0,0,0.2)"
}
const scrollAreaHeight = document.documentElement.clientHeight-document.documentElement.clientWidth*9/16-50
const commentListStyle = {
}
const commentInputStyle = {
	// fontSize:'14px',//material-ui的坑,留着等测试、UI提优化吧
	// lineHeight:'20px',
	// height:'40px',
}
const commentRegButtonStyle = {
	width:'100%',
	height:pxToRem(99),
	lineHeight:pxToRem(99),
	backgroundColor:'#00a3fe',
	textAlign:'center',
	fontSize:'18px',
	color:'#fff',
	position:'fixed',
	bottom:'0',
}
const commentButtonStyle = {
	width:pxToRem(130),
	height:'48px',
	// lineHeight:'48px',
	minWidth: pxToRem(130),
	borderRadius: pxToRem(4),
	backgroundColor: '#00a3fe',
	// boxShadow: '0 3px 8px 0 rgba(41, 143, 255, 0.3)',
}
const dialogItemStyle = {
	width: "100%",
	height: 'auto',
	lineHeight: 'normal',
	padding: `${pxToRem(30)} 0`,
	maxHeight: pxToRem(100)
}
const FORM_FIELD_HEIGHT = pxToRem(98);
const FORM_FIELD_ERROR_MSG = i18n['general.tips.required'];
let commentQueue = []
let fetchIntervalId = 0
let captchaInterval = 0
let tokenRefreshInterval = 0
// images
import iconAreaCodeDataURI from 'images/icon_area_code@3x.png';
import iconPhoneDataURI from 'images/icon_phone_number@3x.png';
import iconPwdDataURI from 'images/icon_password@3x.png';
import iconVerifyDataURI from 'images/icon_verification_code@3x.png';
import iconNameDataURI from 'images/icon_account_number@3x.png';
export class LiveSinglePage extends React.Component {
	constructor(props){
		super(props)
		const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))
		this.state = {
			liveId:this.props.params.id,
			userId:userInfo&&userInfo.userId,
			count:20,//  单次获取弹幕条数
			index:"",//  当前以获取的最大弹幕序号
			fetchInterval:2000,//  弹幕获取间隔ms
			speed:100,//  弹幕刷新速度ms
			isVisit:null,//  是否为游客
			currentTab:'profile',
			commentInput:"",//  评论输入框
			commentList:[],
			isFirstRender:true,
			lastCommentTime:0,//最后一次评论时间
			isDialog:false,
			realname:null,
			"countryCode":"+86",
			"phone": null,
			"phoneCaptcha": null,
			"password": null,
			captchaTimer:60,
		}
	}
	componentWillMount() {
		this.props.checkToken().then(res=>{
			if(res&&res.payload&&res.payload.data){/**登录状态 */
				this.props.fetchLiveUserInfo({liveId:this.state.liveId,userId:this.state.userId})
				this.props.fetchLiveDetail(this.state.liveId)
				tokenRefreshInterval = setInterval(this.props.tokenRefresh,5*60*1000)//每隔5分钟刷新一次token，防止自动登出了
				this.setState({isVisit:false})
			}else{
				this.props.fetchLiveDetailByVisit(this.state.liveId)
				this.setState({isVisit:true})
			}
			return Promise.resolve(res)
		})
	}
	componentDidMount(){
		this.fetchCommentList()
		fetchIntervalId = setInterval(this.fetchCommentList.bind(this),this.state.fetchInterval)
	}
    //  离开组件清除拉取评论定时器
    componentWillUnmount() { 
        clearInterval(fetchIntervalId)
        clearInterval(tokenRefreshInterval)
    }
	componentWillReceiveProps(nextProps) {
		if(this.props.isLogin != nextProps.isLogin && nextProps.isLogin!=null && false){
			if(nextProps.isLogin){//登录状态
				this.props.fetchLiveUserInfo({liveId:this.state.liveId,userId:this.state.userId})
				this.props.fetchLiveDetail(this.state.liveId)
				this.setState({isVisit:false})
			}else{//游客状态
				this.props.fetchLiveDetailByVisit(this.state.liveId)
				this.setState({isVisit:true})
			}
		}
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
	renderAreaCodes() {
		return [
			<MenuItem
				key="+86"
				value="+86"
				primaryText="+86"
			/>
		];
	}
	sendCaptcha = () => {
		if(!phoneRegex.test(this.state.phone) || this.state.captchaTimer!=60){
			this.props.msgDialog(i18n['signup.errormsg.mobile.invalid'])
			return
		}
		this.props.phoneValidate(this.state.phone, this.state.countryCode).then(({payload})=>{
			if(payload.result){
				captchaInterval = setInterval(()=>{
					if(this.state.captchaTimer>0){
						this.setState({captchaTimer:this.state.captchaTimer-1})
					}else{
						clearInterval(captchaInterval)
						this.setState({captchaTimer:60})
					}
				},1000)
			}
		})
	}
	onSubmit = () => {
		if(!this.state.realname){
			this.props.msgDialog(i18n['fastSignup.realname.required'])
			return
		}
		if(!this.state.phone){
			this.props.msgDialog(i18n['signup.errormsg.mobile.invalid'])
			return
		}
		if(!this.state.phoneCaptcha){
			this.props.msgDialog(i18n['signup.errormsg.verifycode.required'])
			return
		}
		if(!this.state.password){
			this.props.msgDialog(i18n['fastSignup.password.required'])
			return
		}
		this.props.registerByPhone({
			countryCode:this.state.countryCode,
			phone: this.state.phone,
			phoneCaptcha: this.state.phoneCaptcha,
			password: this.state.password,
		}).then(({payload})=>{
			if(payload.result){
				doLogin(this.state.countryCode,this.state.phone,this.state.password).then(res=>{
					if(res.result){
						window.location.reload()
					}
				})
			}
		})
	}
	commentChange = e => {
		let val = e.target.value
		if(val.length>200){
			val = val.substring(0,200)
		}
		this.setState({commentInput:val})
	}
	scrollToBottom = () => {
		this.refs.commentList.scrollTop = this.refs.commentList.scrollHeight-scrollAreaHeight
	}
	sendComment(){
		if(!this.state.commentInput){
			this.props.msgDialog(i18n["webcast.comment.not.empty"])
			return 
		}
		if(new Date().getTime()-this.state.lastCommentTime<10000){
			this.props.msgDialog(i18n["webcast.comment.often"])
			return 
		}
		const commentList = this.state.commentList.slice();
		commentList.push({
			userId:this.state.userId,
			userName:this.props.userName,
			userAvatar:"",
			liveId:"",
			index:"",
			timestamp:moment().format('HH:mm:ss'),
			comment:this.state.commentInput,
		})
		this.props.addLiveComment({userId:this.state.userId,liveId:this.state.liveId,comment:this.state.commentInput}).then(()=>{
			this.setState({lastCommentTime:new Date().getTime()})
		})
		this.setState({commentList,commentInput:""},()=>{
			this.scrollToBottom()
		})
	}
	renderCommentQueue(){
		let interval = setInterval(()=>{
			if(commentQueue.length==0){
				this.setState({isFirstRender:false})
				clearInterval(interval)
			}else{
				const comment = commentQueue.shift()
				if(this.state.isFirstRender || comment.userId != this.state.userId){
					const isScroll = this.refs.commentList.scrollTop == this.refs.commentList.scrollHeight-scrollAreaHeight
					comment.timestamp = moment(comment.timestamp,'X').format('HH:mm:ss')
					const commentList = this.state.commentList.slice();
					commentList.push(comment)
					this.setState({commentList},()=>{
						if(this.state.isFirstRender || isScroll){
							this.scrollToBottom()
						}
					})
				}
			}
		},this.state.speed)
	}
	fetchCommentList(){
		this.props.fetchLiveCommentList({
			liveId:this.state.liveId,
			index:this.state.index,
			count:this.state.count,
		}).then(({payload})=>{
			if(payload.result && payload.data.comments.length>0){
				const queueState = commentQueue.length == 0//当前队列如果为空，则启动渲染
				commentQueue = commentQueue.concat(payload.data.comments)
				queueState && this.renderCommentQueue()
				this.setState({index:payload.data.comments.pop().index})
			}
		})
	}
	renderCommentList(){
		return this.state.commentList.map((e,i) => (
			<div key={i}>
				<div className={css["comment_time"]}>{e.timestamp}</div>
				<div className={css["comment_container"]}>
					<div className={css["left_line"]}></div>
					<div style={{flex:1}}>
						<div style={{display:"flex"}}>
							<img className={css["comment_header"]} src={e.userAvatar?e.userAvatar:headerImg}/>
							<div className={css["comment_username"]}>{e.userName}</div>
							{e.isUserAdmin && 'admin'}
						</div>
						<div className={css["comment_text"]}>{e.comment}</div>
					</div>
				</div>
			</div>
		))
	}
	render() {
		if(isVisit === null) return null
		let { liveDetail, isLogin } = this.props;
		const { isVisit } = this.state
		let errTip = ''
		switch(liveDetail&&liveDetail.state){
			case "STARTED":
				errTip = i18n['webcast.error.started']
				break;
			case "NOTSTART":
				errTip = i18n['webcast.error.nostart']
				break;
			default: 
				errTip = i18n['webcast.error.finished']
		}
		return (
			<Page className="live_single_page">
				<PageContent bgColor={"#fff"}>
					<Player
						pullUrl={liveDetail.pullUrl}
						cover={liveDetail.cover} 
						startTime={liveDetail.startTime}
						state={liveDetail.state}
						isLive={true}
						errTip={errTip}
						/>
					<Tabs tabItemContainerStyle={tabItemContainerStyle}
						inkBarStyle={inkBarStyle}
						onChange={this._handleTabsChange}
						value={this.state.slideIndex}>
						<Tab label={i18n['webcast.live.profile']}
							style={{float:"left"}}
							value="profile"
							buttonStyle={ this.state.currentTab == 'profile' ? curButtonStyle : buttonStyle }
							>
							<CastDescription
								type={"livePage"}
								numberOfPeopleWatching={liveDetail.onlineCnt}
								subject={liveDetail.subject}
								startTime={liveDetail.startTime}
								description={liveDetail.description}
								lecturerName={liveDetail.lecturerName}
								lecturerAvatar={liveDetail.lecturerAvatar} />
						</Tab>
						<Tab label={i18n['webcast.live.comment']}
							style={{float:"right"}}
							value="comment"
							buttonStyle={ this.state.currentTab == 'comment' ? curButtonStyle : buttonStyle }
							>
							<div className={css['comment_list']} 
								style={{height:scrollAreaHeight,paddingBottom:this.state.isVisit?'60px':(66+Math.min(Math.floor(this.state.commentInput.length/19),3)*24+'px')}} 
								ref='commentList'>
								{this.renderCommentList()}
							</div>
							{this.state.isVisit?<div style={commentRegButtonStyle} onTouchTap={()=>this.setState({isDialog:true})}>{i18n["webcast.live.signButton"]}</div>:(this.state.currentTab == 'comment' &&
								<div className={css['comment_input_panel']}>
									<TextField onChange={this.commentChange} value={this.props.disable?i18n["webcast.ban.comment.ring.up"]:this.state.commentInput} 
										className={css['comment_input']} style={commentInputStyle} id="commentInput"
										multiLine={true} disabled={this.props.disable}
										rowsMax={3} underlineShow={false}/>
									<RaisedButton label={i18n['webcast.live.comment']} primary={true} onTouchTap={this.sendComment.bind(this)} disabled={this.props.disable}
										className={css['comment_button']} style={commentButtonStyle}/>
								</div>)}
						</Tab>
					</Tabs>
					<Dialog
						title={i18n["webcast.signup.title"]}
						open={this.state.isDialog}
						titleClassName={css['dialog_title']}
						onRequestClose={()=>{this.setState({isDialog:false})}}
						>
						<IconTextField
							fullWidth
							hintText={i18n['fastSignup.realname.required']}
							style={dialogItemStyle}
							height={FORM_FIELD_HEIGHT}
							iconSrc={iconNameDataURI}
							errorText={this.state.realname!==null && !this.state.realname && FORM_FIELD_ERROR_MSG}
							onChange={(e,realname)=>this.setState({realname})}
						/>
						<br />
						<IconSelectField
							fullWidth
							height={FORM_FIELD_HEIGHT}
							iconSrc={iconAreaCodeDataURI}
							value="+86"
						>
							{this.renderAreaCodes()}
						</IconSelectField>
						<br />
						<IconTextField
							fullWidth
							hintText={i18n["webcast.signup.phoneHolder"]}
							style={dialogItemStyle}
							iconSrc={iconPhoneDataURI}
							height={FORM_FIELD_HEIGHT}
							errorText={this.state.phone!==null && !this.state.phone && FORM_FIELD_ERROR_MSG}
							onChange={(e,phone)=>this.setState({phone})}
						/>
						<IconTextField
							fullWidth
							hintText={i18n['forgetpwd.errormsg.verifycode.required']}
							style={Object.assign({},dialogItemStyle,{width:'calc(100% - 120px)'})}
							height={FORM_FIELD_HEIGHT}
							iconSrc={iconVerifyDataURI}
							errorText={this.state.phoneCaptcha!==null && !this.state.phoneCaptcha && FORM_FIELD_ERROR_MSG}
							onChange={(e,phoneCaptcha)=>this.setState({phoneCaptcha})}
						/>
						<RaisedButton
							style={{ display: 'inline-block',width:'105px',marginLeft:'8px',boxShadow: 'none'}}
							buttonStyle={{ height: pxToRem(66),lightHeight: pxToRem(66), lineHeight: pxToRem(66) }}
							overlayStyle={{ height: pxToRem(66), lineHeight: pxToRem(66),border: 'solid 1px '+(this.state.captchaTimer==60?'#00a3fe':'#c5c5c5'),borderRadius: '8px'}}
							labelStyle={{color: this.state.captchaTimer==60?'#00a3fe':'#c5c5c5'}}
							label={this.state.captchaTimer==60?i18n['signup.getverifycode']:this.state.captchaTimer}
							onTouchTap={this.sendCaptcha}
						/>
						<IconTextField
							fullWidth
							hintText={i18n["webcast.signup.pwdHolder"]}
							style={dialogItemStyle}
							height={FORM_FIELD_HEIGHT}
							iconSrc={iconPwdDataURI}
							errorText={this.state.password!==null && !this.state.password && FORM_FIELD_ERROR_MSG}
							onChange={(e,password)=>this.setState({password})}
						/>
						<RaisedButton
							style={{ display: 'block', width: '100%', margin: pxToRem(110) + ' auto 0 auto' }}
							buttonStyle={{ height: pxToRem(88), lineHeight: pxToRem(88) }}
							overlayStyle={{ height: pxToRem(88), lineHeight: pxToRem(88) }}
							label={i18n["webcast.signup.submit"]}
							primary
							onTouchTap={this.onSubmit}
						/>
					</Dialog>
				</PageContent>
			</Page>
		)
	}
}