import {Component} from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import {Button,Table} from 'antd'
import i18n from '@/utils/i18n'
import './noticeDetail.less'
import * as actions from '@/actions/Personal/notices'
import * as appActions from '@/actions/App/app'
class NoticeDetail extends Component{
	
	componentDidMount() {
		this.props.setHeaderTitle(i18n['notice.messageDetail'])
    let id = this.props.match.params.id
    this.props.getNotice(id)

  }
  componentWillReceiveProps(){
    this.props.setHeaderTitle(i18n['notice.messageDetail'])
  }
	render(){
    let notice = this.props.notice
		return(
			<div className="notice-detail">
        <Button className="tw-btn-primary" onClick={()=>{this.props.history.go(-1)}}>{i18n['general.back']}</Button>
				<h2>{notice.title}</h2>
        <div>{i18n['notice.messageType']}：{notice.type}</div>
        <div>{i18n['notice.addresser']}：{notice.addresser}</div>
        <div>{i18n['notice.time']}：{notice.time}</div>
        <div dangerouslySetInnerHTML={{__html:notice.content}}>
        </div>
			</div>
		)
	}
}
export default connect(
  ({ app,personal}) => {
    let notice = personal.notice[0]||{}
    return {
			notice : {
        title: notice.title,
        type: i18n['notice.systemInfo'],
        addresser: notice.fromName,
        time: notice.sendDate,
        content: notice.content
      }
    }
  }, 
  {
		...actions,
		...appActions
  })(NoticeDetail)
