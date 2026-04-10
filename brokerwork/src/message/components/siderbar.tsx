import * as React from 'react';
import {
	ButtonGroup, DropdownButton, MenuItem, Dropdown,
	Glyphicon, Grid
} from 'react-bootstrap';
import { Button, LoadingMask } from 'fooui';
import PubSub from '../../common/pubsub';
import { HttpClient } from "../../http/httpclient";
import { Link } from 'react-router';
import {I18nLoader} from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';

interface P {

}
interface S {
	activeMenu?: string;
	numInboxMessages?: number;
	numOutboxMessges?: number;
	numDraftboxMessages?: number;
}

const MENU = {
	RECEIVE_BOX: 'RECEIVEBOX',
	SEND_BOX: 'SENDBOX',
	DRAFT_BOX: 'DRAFTBOX',
	RECYCLE_BOX: 'RECYCLEBOX'
}

function linkValue(str) {
	if (location.href.indexOf('localhost') != -1) {
		return str.replace(/(#.*$)/, function (match) {
			return '?$Path=/dev' + match;
		})
	}
	return str;
}

class MsgSiderBar extends React.Component<P, S> {
	token1: any;
	token2: any;
	token3: any;
	messageMenu = [
		{text: I18nLoader.get('message.inbox'), url: 'receivebox', size: 'numInboxMessages', icon: 'fa-inbox'},
		{text: I18nLoader.get('message.outbox'), url: 'sendbox', size: 'numOutboxMessges', icon: 'fa-envelope-o'},
		{text: I18nLoader.get('message.draft_box'), url: 'draftbox', size: 'numDraftboxMessages', icon: 'fa-file-text-o'},
		{text: I18nLoader.get('message.recycle_bin'), url: 'recyclebox', size: null, icon: 'fa-trash-o'},
	]
	constructor(props: P) {
		super(props);
		this.state = {
			activeMenu: MENU.RECEIVE_BOX,
			numInboxMessages: 0,
			numOutboxMessges: 0,
			numDraftboxMessages: 0
		}
	}
	componentWillMount() {
		this.fetchMsg();
	}
	fetchMsg = () => {
		let url = "/v1/message/count";
		LoadingMask.maskAll();
		HttpClient.doPost(url)
			.then((res) => {
				LoadingMask.unmaskAll();
				if (res.result) {
					var data = res.data || [];
					let keywords: string = 'inbox';
					PubSub.publish('draftbox' + '.size.change', data.draftCount);
					PubSub.publish('inbox' + '.size.change', data.unReadCount);
					PubSub.publish('outbox' + '.size.change', data.sendCount);
				}
			})
	}

	componentDidMount() {
		this.token1 = PubSub.subscribe('inbox.size.change', (size) => {
			this.setState({ numInboxMessages: size })
		})
		this.token2 = PubSub.subscribe('outbox.size.change', (size) => {
			this.setState({ numOutboxMessges: size })
		})
		this.token3 = PubSub.subscribe('draftbox.size.change', (size) => {
			this.setState({ numDraftboxMessages: size })
		})
	}
	componentWillUnmount() {
		PubSub.unsubscribe(this.token1);
		PubSub.unsubscribe(this.token2);
		PubSub.unsubscribe(this.token3);
	}
	addMesHandler = () => {
		window.location.href = linkValue("#/addMessage")
	}
	render() {
		return (
			<div className="mail-box-sidebar">
				<div className={ PrivilegeHelper.getHavePrivilege("MESSAGE_SEND") ? "add-btn btn btn-primary fa fa-plus" : "privilegeNo"} onClick={this.addMesHandler}>{I18nLoader.get('message.add')}</div>
				<menu className="nav-items">
					{this.messageMenu.map((item, index) => {
						if (item.text === I18nLoader.get('message.inbox')){
							return (
							        <Link
								        to={item.url}
								        className={`nav-item`}
								        activeClassName={'active'}
							        >
								        <span className={`fa ${item.icon}`}></span>
								        <span className="text">{item.text}</span>
								        {item.size
								        ? <span className="badge">{this.state[item.size]}</span>
								        : undefined}
							        </Link>
						        );
						 }else{
							 return (
							        <Link
								        to={item.url}
								        className={`nav-item`}
								        activeClassName={'active'}
							        >
								        <span className={`fa ${item.icon}`}></span>
								        <span className="text">{item.text}</span>
								        {item.size
								        ? <span className="greySendboxStyle">({this.state[item.size]})</span>
								        : undefined}
							        </Link>
						        );
						 }
						
					})}
				</menu>
			</div>
		)
	}

}
export { MsgSiderBar }