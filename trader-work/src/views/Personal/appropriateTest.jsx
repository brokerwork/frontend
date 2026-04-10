import {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import i18n from '@/utils/i18n'
import * as actions from '@/actions/Personal/appropriateTest'
import {setHeaderTitle} from '@/actions/App/app'
import moment from 'moment';
import Button from '@/components/Button'
import "./appropriateTest.less"
import defaultImg from '../../images/test_default.png'
import defaultRefuseImg from '../../images/test_default_fail.png'
class AppropriateTest extends Component{
	constructor(props){
		super(props)
		this.props.getAppropriateTest()
	}
	componentDidMount(){
		this.props.setHeaderTitle(i18n['menu.personal.test'])
	}
	componentWillReceiveProps(){
		this.props.setHeaderTitle(i18n['menu.personal.test'])
	  }
	goTest = () => { 
		this.props.history.push('/account/open/acttest')
	}
	render(){
		const { res, accountList, } = this.props
		console.log(1,accountList)
		return res?
			<div className="appropriate-test">
				{res.hasTested?
				<div>
					<div className="top-title">{i18n['menu.personal.test']+i18n['test.appropriate.result']}</div>
					<div className="top-tips">
						<img src={res.result=='approve'?defaultImg:defaultRefuseImg}/>
						<div className="top-tips-content">
							<div>{res.result=='approve'?i18n['test.appropriate.successTip']:i18n['test.appropriate.failTip']}</div>
							<Button type="primary" onClick={this.goTest}>{i18n['test.appropriate.testAgain']}</Button>
						</div>
					</div>
					<div className="result-item">
						<i className="iconfont icon-icon_date"></i>
						<div className="result-item-label">{i18n['test.appropriate.testDate']}</div>
						<div className="result-item-text">{moment(res.time).format('YYYY-MM-DD')}</div>
					</div>
					<div className="result-item">
						<i className="iconfont icon-icon_score"></i>
						<div className="result-item-label">{i18n['test.appropriate.testScore']}</div>
						<div className="result-item-text">
							{res.score}&nbsp;&nbsp;<span className="result-item-score">
								({i18n['test.appropriate.totalScore']+res.totalScore})
								</span>
							</div>
					</div>
					<div className="result-item">
						<i className="iconfont icon-icon_result"></i>
						<div className="result-item-label">{i18n['test.appropriate.test']+i18n['test.appropriate.result']}</div>
						<div className="result-item-text">{res.resultContent}</div>
					</div>
					<div className="result-item">
						<i className="iconfont icon-icon_state"></i>
						<div className="result-item-label">{i18n['test.appropriate.openState']}</div>
							<div className="result-item-text">
								{
									accountList.liveAccountList.length > 0 ? i18n['test.appropriate.opened'] :
									<div>
										<span>{i18n['test.appropriate.noOpen']}</span>
										{res.result=='approve'&&<span>，{i18n['test.appropriate.click']}<Link to="/account/open">{i18n['overview.openaccount']}</Link></span>}
									</div>
								}
						</div>
					</div>
				</div>:
				<div className="top-tips">
					<img src={defaultImg}/>
					<div className="top-tips-content">
						<div>{i18n['test.appropriate.noTestTip']}</div>
							<Button type="primary" onClick={this.goTest}>{i18n['test.appropriate.beginTest']}</Button>
					</div>
				</div>}
			</div>:null
	}
}
export default connect(
  ({ app,personal}) => {
    return {
	  accountList: app.accountList,
	  res: personal.appropriateTestResult,
    }
  }, 
  {
	...actions,
	setHeaderTitle,
  })(AppropriateTest)