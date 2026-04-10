import { PureComponent } from 'react'
import classNames from 'classnames';

import './index.less'

//主题卡片通用组件
export default class Card extends PureComponent  { 
    constructor(props) { 
        super(props)
    }
    render() {
		const {
			title, defClass, className, children, ...other } = this.props
		const classes = classNames({
			[defClass]: true,
			[className]: className,
		})
        return (
        	<div className={classes} {...other}>
				<div className='card-header'>{title}</div>
				<div className='card-content'>{children}</div>
			</div>
        )
    }
}
// Card.propTypes = {
// 	className: PropTypes.string,
// }
Card.defaultProps = {
	defClass: 'card-theme',
}
