import React, { Component } from 'react';
import { Card } from 'widgets/Card';
import RaisedButton from 'material-ui/RaisedButton';

export class DisclaimerCard extends Component {
	static defaultProps = {
		show: false
	}
	_close = () => {
		this.setState({ show: false })
	}
	// componentWillMount(){
	// 	console.log('DisclaimerCard componentWillMount')
	// }
	// componentDidUpdate(){
	// 	console.log('DisclaimerCard componentDidUpdate')
	// }
	// componentDidMount(){
	// 	console.log('DisclaimerCard componentDidMount')
	// }
	// componentWillReceiveProps(newProps){
	// 	console.log('DisclaimerCard componentWillReceiveProps')
	// }
	render() {
		// console.log('DisclaimerCard render')
		let {show, actions, title} = this.props;
		return (
			<Card
				show={show}
				title={title}
				actions={actions}>
					{this.props.children}
			</Card>
		)
	}
}

DisclaimerCard.propTypes = {
	show: React.PropTypes.bool.isRequired
}