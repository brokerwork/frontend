import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cs from './index.css';
import i18n from 'utils/i18n';

let nextid = 0x2b845;
const ITEM_HEIGHT = 40;

const DEFAULT_YEARS = makeArray(2015, 2017);
const DEFAULT_MONTHS = makeArray(1, 12);
const DEFAULT_DAYS = makeArray(1, 31);

function makeArray(start, end) {
	let arr = [];
	for (let i = start; i <= end; i++) {
		arr.push(i)
	}
	return arr;
}

function getDefaultYear() {
	return new Date().getFullYear();
}

function getDefaultMonth() {
	return new Date().getMonth() + 1;
}

function getDefaultDate() {
	return new Date().getDate();
}

/**
 * controled react component
 * example:
 * <DatePicker show={this.state.show} />
 * 
 * more complex example:
 * <DatePicker 
			show={this.state.show}
			year={this.state.year}
			month={this.state.month}
			day={this.state.day}
			mode={['year', 'month', 'day']} 
			onChange={(p)=>{alert(JSON.stringify(p))}}
			onConfirm={()=>{this.setState({show:false})}}
			onCancel={()=>{this.setState({show:false})}}
		/>
 */
export class DatePicker extends Component {

	static defaultProps = {
		mode: ['year', 'month', 'day'],
		years: DEFAULT_YEARS,
		months: DEFAULT_MONTHS,
		days: DEFAULT_DAYS,
		show: false
	}

	constructor(props) {
		super(props);
		this.lastday = null;
		this.state = {
			year: props.year || getDefaultYear(),
			month: props.month || getDefaultMonth(),
			day: props.day || getDefaultDate(),
			show: props.show
		}
	}

	_addEvents() {
		let dpk = document.querySelector(`#${this.id}`);
		dpk.addEventListener("touchmove", function (e) {
			e.stopPropagation()
		}, false)

		let { years, months, days } = this.props;

		let yearNode = document.querySelector(`#${this.id} .year`);
		yearNode.addEventListener('touchmove', (e) => {
			
			let scrollTop = yearNode.scrollTop;
			let offset = Math.floor(scrollTop / ITEM_HEIGHT);
			let year = years[offset];
			let day = this._updateCrossDayValue(year, this.state.month);
			//console.log('=====year====', year)
			this.setState({ year: year, day: day }, () => { this.lastday = day })
		}, false)
		yearNode.addEventListener('touchend', (e) => { //use a better position after select item
			let j = years.indexOf(this.state.year);
			yearNode.scrollTop = j * ITEM_HEIGHT;
			//fix last day
			let k = days.indexOf(this.lastday);
			dayNode.scrollTop = k * ITEM_HEIGHT;
		}, false)

		let monthNode = document.querySelector(`#${this.id} .month`);
		monthNode.addEventListener('touchmove', (e) => {
			let scrollTop = monthNode.scrollTop;
			let offset = Math.floor(scrollTop / ITEM_HEIGHT);
			let month = months[offset];
			let day = this._updateCrossDayValue(this.state.year, month);
			//console.log('=====month====', month)
			this.setState({ month: month, day: day }, () => { this.lastday = day })
		}, false)
		monthNode.addEventListener('touchend', (e) => { //use a better position after select item
			let j = months.indexOf(this.state.month);
			monthNode.scrollTop = j * ITEM_HEIGHT;
			//fix last day
			let k = days.indexOf(this.lastday);
			dayNode.scrollTop = k * ITEM_HEIGHT;
		}, false)

		let dayNode = document.querySelector(`#${this.id} .day`);
		dayNode.addEventListener('touchmove', (e) => {
			let scrollTop = dayNode.scrollTop;
			let offset = Math.floor(scrollTop / ITEM_HEIGHT);
			let day = days[offset];
			this.lastday = day;
			this.setState({ day: day })
		}, false)
		dayNode.addEventListener('touchend', (e) => { //use a better position after select item
			let j = days.indexOf(this.state.day);
			dayNode.scrollTop = j * ITEM_HEIGHT;
		}, false)
	}

	_updateCrossDayValue = (selectedYear, selectedMonth) => {
		let newLastDay = new Date(selectedYear, selectedMonth, 0).getDate();
		let oldLastDay = this.lastday;
		//console.log(newLastDay, oldLastDay)
		let newDay = Math.min(newLastDay, oldLastDay);
		return newDay;
	}

	_restore = () => {
		let { years, months, days } = this.props;
		let { year, month, day } = this.state;
		let yearNode = document.querySelector(`#${this.id} .year`);
		let monthNode = document.querySelector(`#${this.id} .month`);
		let dayNode = document.querySelector(`#${this.id} .day`);
		let idx, scrollTop;

		idx = years.indexOf(year);
		scrollTop = idx * ITEM_HEIGHT;
		yearNode.scrollTop = scrollTop;

		idx = months.indexOf(month);
		scrollTop = idx * ITEM_HEIGHT;
		monthNode.scrollTop = scrollTop;

		idx = days.indexOf(day);
		scrollTop = idx * ITEM_HEIGHT;
		dayNode.scrollTop = scrollTop;
	}

	_initialize = () => {
		if (!this.initialized) {
			this.initialized = true;
			this._addEvents();
			this._restore();
		}
	}

	_handleConfirm = () => {
		let { onConfirm, onChange, mode } = this.props;
		let hasYear = mode.indexOf('year') != -1;
		let hasMonth = mode.indexOf('month') != -1;
		let hasDay = mode.indexOf('day') != -1;
		let params = {};
		if (hasYear) {
			params['year'] = this.state.year
		}
		if (hasMonth) {
			params['month'] = this.state.month
		}
		if (hasDay) {
			params['day'] = this.state.day
		}
		this.setState({ show: false })
		onConfirm && onConfirm();
		onChange && onChange(params);
	}

	_handleCancel = () => {
		let { onCancel } = this.props;
		this.setState({ show: false })
		onCancel && onCancel();
	}

	componentWillReceiveProps(newProps) {
		let oldState = this.state;
		let newState = Object.assign({}, oldState);
		let stateKeys = ['year', 'month', 'day', 'show'];
		stateKeys.forEach(k => {
			if (newProps[k] != null && oldState[k] != newProps[k]) {
				newState[k] = newProps[k]
			}
		})
		this.setState(newState)
	}

	_destory = () => {
		ReactDOM.unmountComponentAtNode(this.domWrapper);
		document.body.removeChild(this.domWrapper);
	}

	componentDidMount() {
		this.id = `dpk-${nextid}`;
		nextid++;
		this.domWrapper = document.createElement('div');
		document.body.appendChild(this.domWrapper);
		this.domWrapper.classList.add('g-mask');
		this._renderLayer();
		this._initialize();
	}

	componentWillUnmount() {
		this._destory();
	}

	componentDidUpdate() {
		this._renderLayer();
	}

	_calculateDays() {
		let { year, month } = this.state;
		let firstDay = new Date(year, month - 1, 1);
		let lastDay = new Date(year, month, 0);
		let days = [];
		for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
			days.push(i)
		}
		return days;
	}

	_renderLayer = () => {
		let { mode } = this.props;
		let { show } = this.state;
		this.domWrapper.style.display = show ? 'block' : 'none';
		let hasYear = mode.indexOf('year') != -1;
		let hasMonth = mode.indexOf('month') != -1;
		let hasDay = mode.indexOf('day') != -1;
		let displayText = [];
		hasYear && displayText.push(this.state.year);
		hasMonth && displayText.push(this.state.month)
		hasDay && displayText.push(this.state.day);

		let jsxElement = (
			<div id={`${this.id}`} className="datepicker">
				<div className="datepicker-head">
					<label className="cancel" onTouchTap={this._handleCancel}>{i18n['tausermgmt.cancel']}</label>
					<label className="title">{displayText.join('/')}</label>
					<label className="confirm" onTouchTap={this._handleConfirm}>{i18n['forgetpwdstep3.confirm']}</label>
				</div>
				<div className="datepicker-body">
					<div className="indicator"></div>
					<div className="year column" style={{ display: hasYear ? 'block' : 'none' }}>
						<div className="col-mask"></div>
						<div className="col-items">
							{
								this.props.years.map(y => {
									return (<div key={y} className="row">{y}{i18n['mobile.fundflow.year']}</div>)
								})
							}
						</div>
					</div>
					<div className="month column" style={{ display: hasMonth ? 'block' : 'none' }}>
						<div className="col-items">
							{
								this.props.months.map(m => {
									return <div key={m} className="row">{m}{i18n['mobile.fundflow.month']}</div>
								})
							}
						</div>
					</div>
					<div className="day column" style={{ display: hasDay ? 'block' : 'none' }}>
						<div className="col-items">
							{
								this._calculateDays().map(d => {
									return <div key={m} className="row">{m}{i18n['mobile.fundflow.day']}</div>
									return <div key={d} className="row">{d}</div>
								})
							}
						</div>
					</div>
				</div>
			</div>
		)
		ReactDOM.render(jsxElement, this.domWrapper, ()=>{
			setTimeout(()=>{
				this._restore();
			},300)
		})
		document.querySelector(`#${this.id}`).style.top = '100%';
		setTimeout(() => {
			document.querySelector(`#${this.id}`).style.top = 'calc(100% - 320px)'
		})
	}

	render() {
		return null;
	}
}

DatePicker.propTypes = {
	years: React.PropTypes.array, // [2015,2016,2017]
	months: React.PropTypes.array, // [1,2,3,4,5...12]
	days: React.PropTypes.array, // [1,2,3,4,5...31]

	onCancel: React.PropTypes.func,
	onConfirm: React.PropTypes.func,
	onChange: React.PropTypes.func, // ({year,month,day})=>{}
	mode: React.PropTypes.array, // ['year','month','day']

	year: React.PropTypes.number, //selected year value
	month: React.PropTypes.number, //selected month value
	day: React.PropTypes.number, //selected day value

	show: React.PropTypes.bool.isRequired
}