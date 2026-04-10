import React, { Component } from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import { pxToRem } from 'utils/styleUtils';
import i18n from 'utils/i18n';

let bottomNavigationStyle = {
	height: pxToRem(105)
}

let bottomNavigationItemStyle = {
	paddingBottom: '8px',
	maxWidth: "50%"
}
let info = require('images/info.png');
let infoLight = require('images/info_light.png');
let accounts = require('images/account.png');
let accountsLight = require('images/account_light.png');
let cast = require("images/cast.png");
let castLight = require("images/cast_light.png");
let imgStyle = {
	width: pxToRem(40),
	height: pxToRem(40)
};

export class ApplicationNavigation extends Component {

	static contextTypes = {
		router: React.PropTypes.object
	}

	static defaultProps = {
		hasLiveBroadCast: false,
		hasMarket: false
	}

	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: this._getDefaultIndex()
		}
	}

	_getDefaultIndex = () => {
		let { defaultSelectedIndex, selectedIndex } = this.props;
		let index = -1;
		if (selectedIndex != null) {
			index = selectedIndex;
		}
		if (defaultSelectedIndex != null) {
			index = defaultSelectedIndex;
		}
		return index;
	}

	componentWillReceiveProps(newProps) {
		let { selectedIndex } = this.state;
		if (newProps.selectedIndex != null && newProps.selectedIndex != selectedIndex) {
			this.setState({ selectedIndex: newProps.selectedIndex })
		}
	}
	_onNavigationChange = (value) => {
		this.setState({ selectedIndex: value })
		let { onChange } = this.props;
		onChange && onChange(value)
		switch (value) {
			case 0:
				{
					this.context.router.push("/accounts");
					break;
				}
			case 1:
				{
					this.context.router.push("/livebroadcast");
					break;
				}
			case 2:
				{
					this.context.router.push("/personal");
				}
		}
	}
	render() {
		let { selectedIndex } = this.state
		const { visibleData } = this.props
		let iconAccounts = <FontIcon style={{ fontSize: 'initial' }}>
			<img src={selectedIndex === 0 ? accountsLight : accounts} style={imgStyle} />
		</FontIcon>;
		let iconCast = <FontIcon style={{ fontSize: 'initial' }}>
			<img src={selectedIndex === 1 ? castLight : cast} style={imgStyle} />
		</FontIcon>;
		let iconInfo = <FontIcon style={{ fontSize: 'initial' }}>
			<img src={selectedIndex === 2 ? infoLight : info} style={imgStyle} />
		</FontIcon>;
		let isVisible = JSON.parse(localStorage.getItem('VISIBLE_DATA')) || [true, false, false]
		if (visibleData && visibleData.length){ 
			isVisible = [true, visibleData.indexOf('Live') !== -1, visibleData.indexOf('User') !== -1]
		}
		const width = isVisible.length===0?0:(100/isVisible.length+"%")
		return (
			<BottomNavigation
				selectedIndex={selectedIndex}
				style={bottomNavigationStyle}>
				<BottomNavigationItem
					style={bottomNavigationItemStyle}
					label={i18n['mobile.accounts.list.key']}
					style={{float:"left",width}}
					icon={iconAccounts}
					onTouchTap={() => { this._onNavigationChange(0) }}>
				</BottomNavigationItem>
				{
					isVisible[1] ? <BottomNavigationItem
							style={bottomNavigationItemStyle}
							label={i18n['menu.broadcast']}
							style={{float:"left",width}}
							icon={iconCast}
							onTouchTap={() => { this._onNavigationChange(1) }}>
					</BottomNavigationItem> : <div style={{width: 0, flex: 'none'}}></div>
				}
				{
					isVisible[2] ? <BottomNavigationItem
						style={bottomNavigationItemStyle}
						label={i18n['mobile.personal.info.key']}
						style={{float:"left",width}}
						icon={iconInfo}
						onTouchTap={() => { this._onNavigationChange(2) }}>
					</BottomNavigationItem> : <div style={{width: 0, flex: 'none'}}></div>
				}
			</BottomNavigation>
		)
	}
}

ApplicationNavigation.propTypes = {
	defaultSelectedIndex: React.PropTypes.number,
	selectedIndex: React.PropTypes.number,
	onChange: React.PropTypes.func,
	hasLiveBroadCast: React.PropTypes.bool,
	hasMarket: React.PropTypes.bool
}