import * as React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import CircularProgress from 'material-ui/CircularProgress';
import { setCachedToken, getCachedToken } from 'utils/userinfo';
import MsgDialog from './widgets/MsgDialog'
import wxUtils from 'utils/wxUtils'
import * as commonActions from './common/commonActions';
import './less/common.less'

let style = {
	top: '50%',
	left: '50%',
	position: 'absolute',
	transform: 'translate(-50%, -50%)'
}
let popup = {
	top: 0,
	left: 0,
	zIndex: 9999,
	width: '100%',
	height: '100%',
	position: 'fixed'
}
class Redirect extends React.Component {
	componentWillMount() {
		var token = window.GlobalVar.token;
		var realToken = getCachedToken()
		if (token) {
			setCachedToken(token);
		}
		if (window.location.href.indexOf('fromApp') != -1 && realToken && realToken != 'unkown') { 
			this.props.getStructuralList().then((res) => { 
				if (res && res.payload && res.payload.result){ 
					window.localStorage.setItem('LIST', JSON.stringify(res.payload.data))
				}
			})
		}
		//	登录失效或者没有路由,跳转至入口
		let pathName = this.props.router.location.pathname
		if (!realToken || realToken === 'null' || realToken === 'undefined' || realToken === 'unkown' || pathName == '/') {
			if(pathName.indexOf('/livebroadcast/') == -1)
				this.props.router.replace('/entrance')
		}
	}
	componentDidMount() {
		const { visibleModules, getCountryPhone } = this.props
		getCountryPhone()
		visibleModules().then((data) => {
			if (data && data.payload && data.payload.result){ 
				let visibleData = data.payload.data
				let isVisible = [true, visibleData.indexOf('Live') !== -1, visibleData.indexOf('User') !== -1]
				window.localStorage.setItem('VISIBLE_DATA', JSON.stringify(isVisible))
				if (visibleData.indexOf('Mobile Web') === -1 && !wxUtils.isWechat() && window.location.href.indexOf('localhost') === -1){ 
					window.location.href = '/personal/overview'
				}
			}
		})
	}
	render() {
		return <div style={{width: '100%', height: '100%'}}>
			{this.props.children}
			{
				this.props.isLoading && <div style={popup}>
					<CircularProgress
					style={style}/>
				</div>									
			}
			<CSSTransitionGroup
				transitionName='fade'
				transitionEnterTimeout={250}
    			transitionLeaveTimeout={250}>
			{
				this.props.msg && <div style={popup} className='flex-center'>
						<MsgDialog
							msg={this.props.msg}
							closeMsgDialog={this.props.closeMsgDialog}/>
					</div>
			} 
			</CSSTransitionGroup>	
		</div>
	}
}

export default connect(
	(state) => ({
		isLoading: state.common.isLoading,
		msg: state.common.msg,
		visibleData: state.common.visibleData
	}),
	{...commonActions}
)(Redirect)