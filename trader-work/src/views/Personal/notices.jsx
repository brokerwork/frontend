import {Component} from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import {Button,Table} from 'antd'
import {setHeaderTitle, auth} from '@/actions/App/app'
import i18n from '@/utils/i18n'
import './notices.less'
import * as actions from '@/actions/Personal/notices'
import * as appActions from '@/actions/App/app'
class NoticeList extends Component{
	constructor(props){
		super(props)
		this.state = {
			page: 1,
			total: 0,
			hasReadAll: true
		}
	}
	componentWillReceiveProps(){
		this.props.setHeaderTitle(i18n['menu.personal.overview'])
	}
	componentDidMount() {
		this.props.setHeaderTitle(i18n['menu.personal.overview'])
		this.fetchNotices(1)
		this.props.getUnreadNotices('WEB')
		.then(rs=>{
			if(rs.result&&!!rs.data.length){
				this.setState({
					hasReadAll: false
				})
			}
		})
		this.props.getUnreadNotices('WEB_ALERT')
		.then(rs=>{
			if(rs.result&&!!rs.data.length){
				this.setState({
					hasReadAll: false
				})
			}
		})
	}
	onChange = (page)=>{
		this.fetchNotices(page.current)
	}
	fetchNotices = (current)=>{
		this.props.getNotices(current)
		.then(rs=>{
			if(rs.result){
				let doms = document.getElementsByClassName('nr')
				for(let i = 0;i<doms.length;i++){
					let el = doms[i]
					el.parentNode.parentNode.style.background = '#f7f7f8'
				}
				this.setState({
					page: rs.data.pager,
					total: rs.data.total
				})
			}
		})
	}
	readAll = ()=>{
		this.props.readAll()
		.then(rs=>{
			if(rs.result){
				this.setState({
					hasReadAll: true
				})
				setTimeout(()=>{
					let doms = document.getElementsByClassName('ant-table-row')
					for(let i = 0;i<doms.length;i++){
						let el = doms[i]
						el.style.background = 'none'
					}
				},200)
				
			}
		})
	}
	onRowClick = record=>{
		if(!record.read){
			this.props.readSome({id: [record.readId]})
		}
		this.props.history.push(`noticeList/${record.id}`)
	}
	render(){
		const columns = [
			{
				title: i18n['notice.addresser'],
				dataIndex: 'fromName',
				key: 'fromName',
			},
			{
				title: i18n['notice.title'],
				dataIndex: 'title',
				key: 'title',
			},
			{
				title: i18n['notice.type'],
				dataIndex: 'type',
				key: 'type',
				render(text,record){
					if(!record.read){
						return (
							<span className="nr">{text}</span>
						)
					}else{
						return text
					}
				}
			},
			{
				title: i18n['notice.time'],
				dataIndex: 'time',
				key: 'time',
			}, ];
		
		let pagination = {
			showQuickJumper: true,
			current: this.state.page,
			total: this.state.total,
			
		}
		return(
			<div className="notice-header">
				<h2 className="clearfix">
					{i18n['notice.all']}
					<Button className="tw-btn-primary" onClick={this.readAll} disabled={this.state.hasReadAll}>{i18n['notice.market']}</Button>
				</h2>
				<Table onRowClick={this.onRowClick} columns={columns} dataSource={this.props.notices} pagination={pagination} onChange={this.onChange}/>
			</div>
		)
	}
}
export default connect(
  ({ app,personal}) => {
		let noticeList = personal.notices.map(el=>{
			return {
				id: el.messageId,
				readId: el.inboxId,
				type: i18n['notice.systemInfo'],
				title: el.title,
				time: el.receiveDate,
				content: el.content,
				read: el.read,
				fromName: el.fromName
			}
		})
    return {
			notices: noticeList,
			unReadNotices: app.unReadNotices
    }
  }, 
  {
		...actions,
		...appActions,
		setHeaderTitle,
		auth
  })(NoticeList)
