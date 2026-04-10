import React from 'react';
import css from './index.less';

export class Page extends React.Component {
	static contextTypes = {
		router: React.PropTypes.object
	}
	render() {
		let childs = [];
		React.Children.map(this.props.children, (child) => {
			childs.push(React.cloneElement(child))
		})
		var content = childs.filter((child) => {
			return child.type.name == 'PageContent';
		})[0];
		var footer = childs.filter((child) => {
			return child.type.name == 'PageFooter';
		})[0]
		if (footer == null) {
			content = React.cloneElement(content, { fullPage: true })
		}

		return (
			<div className={css['page']}>
				{content}
				{footer}
			</div>
		)
	}

}

Page.propTypes = {
	className: React.PropTypes.string,
	fullPage: React.PropTypes.bool
}

export class PageContent extends React.Component {

	static defaultProps = {
		bgColor: "#fafafa"
	}

	componentDidMount() {
		// window.loaded();
	}
	render() {

		return (
			<div className={css['page-content']} style={{backgroundColor: this.props.bgColor}}>
				{this.props.children}
			</div>)
	}
}

PageContent.propTypes = {
	bgColor: React.PropTypes.string
}

export class PageFooter extends React.Component {
	render() {
		return (
			<div className={css["page-footer"]} style={this.props.style}>
				{this.props.children}
			</div>
		)
	}
}
