import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cs from './index.less';
import classnames from 'classnames';

const getScrollHeight = (ref) => { return ReactDOM.findDOMNode(ref).scrollHeight }
const DEFAULT_HEIGHT = '100';

export class IScrollView extends Component {
	constructor(props) {
		super(props);
		this.iscroll = null;
		this.wrapperScrollHeight = '';
		this.wrapperNextScrollHeight = '';
	}

	componentDidMount() {
		let { onScrollBottom, onScrollTop } = this.props;
		let element = ReactDOM.findDOMNode(this.refs.wrapper)
		let iscroll = this.iscroll = new IScroll(element, {
			scrollbars: true,
			fadeScrollbars: true
		});
		iscroll.on('scrollEnd', () => {
			if (iscroll.y === iscroll.maxScrollY) {
				onScrollBottom && onScrollBottom();
			}
			if (iscroll.y === 0) {
				onScrollTop && onScrollTop();
			}
		})
		this.wrapperScrollHeight = getScrollHeight(this.refs.wrapper)
		setTimeout(() => {
			this._updateScroll();
		}, 500);

		window.view = this;
	}

	componentDidUpdate() {
		this.wrapperNextScrollHeight = getScrollHeight(this.refs.wrapper);
		if (this.wrapperScrollHeight !== '' && this.wrapperScrollHeight != this.wrapperNextScrollHeight) {
			this.wrapperScrollHeight = this.wrapperNextScrollHeight;
			this._updateScroll();
		}
	}

	_updateScroll = ()=> {
		let {name}=this.props;
		this.iscroll.refresh();
	}

	render() {
		let { style, className, scrollAreaStyle, scrollAreaClassName, height } = this.props;
		let wrapperClass = classnames({
			'scroll-view': true,
			[className]: className != null
		})
		let wrapperStyle = Object.assign({}, style);
		if (this.props.height != null){
			wrapperStyle = Object.assign({}, wrapperStyle, {height: this.props.height})
		}
		let scrollAreaClass = classnames({
			'scroll-area': true,
			[scrollAreaClassName]: scrollAreaClassName != null
		});
		let { children } = this.props;
		return (
			<div ref="wrapper" className={wrapperClass} style={wrapperStyle}>
				<div className={scrollAreaClass} style={scrollAreaStyle}>
					{children}
				</div>
			</div>
		)
	}
}

IScrollView.propTypes = {
	style: React.PropTypes.object,
	className: React.PropTypes.string,
	scrollAreaStyle: React.PropTypes.object,
	scrollAreaClassName: React.PropTypes.string,
	height: React.PropTypes.any, // 此高度为最高优先级，必填
	onScrollTop: React.PropTypes.func,
	onScrollBottom: React.PropTypes.func
}