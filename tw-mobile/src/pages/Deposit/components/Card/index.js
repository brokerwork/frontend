import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { unstable_renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import css from './index.less';
import i18n from 'utils/i18n'

export class Card extends Component {

	static propTypes = {
		show: React.PropTypes.bool,
		title: React.PropTypes.string,
		onCancel: React.PropTypes.func,
		onOk: React.PropTypes.func
	}

	static defaultProps = {
		show: false
	}

	constructor(props) {
		super(props);
		this.overlay = null;
		this.wrapper = null;
	}

	componentDidMount() {
		this._render();
	}

	componentDidUpdate() {
		this._render();
	}
	componentWillUnMount() {
		this._purge();
	}

	componentWillReceiveProps(newProps) {
	}

	_purge = () => {
		if (this.wrapper) {
			this.wrapper.style.top = '100%';
			setTimeout(() => {
				unmountComponentAtNode(this.overlay)
				document.body.removeChild(this.overlay);
				this.overlay = this.wrapper = null;
			}, 200)
		}
	}

	_render() {
		let { show } = this.props;
		let elementToRender = this._renderComponents();
		if (show) {
			if (!this.overlay) {
				this.overlay = document.createElement('div');
				document.body.appendChild(this.overlay);
				this.overlay.className = css['tw-mobile-modal-overlay'];
			}
			this.wrapper = unstable_renderSubtreeIntoContainer(this, elementToRender, this.overlay)
			setTimeout(() => {
				this.wrapper.style.top = 0;
			}, 200)
		} else {
			console.log('hide card');
			this._purge();
		}
	}

	_renderComponents() {
		return (
			<div className={css["tw-mobile-modal-body"]}>
				<div className={css["tw-mobile-modal-head"]}>
					<span className={css["title"]}>{this.props.title}</span>
					<span className={css["cancel"]} onTouchTap={this.props.onCancel}>{i18n['general.button.cancel']}</span>
					<span className={css["ok"]} onTouchTap={this.props.onOk}>{i18n['tausermgmt.confirm']}</span>
				</div>
				<div className={css["tw-mobile-modal-content"]}>{this.props.children}</div>
			</div>
		)
	}

	render() {
		console.log('Card render')
		return null
	}
}