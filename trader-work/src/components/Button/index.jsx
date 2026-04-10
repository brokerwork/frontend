import { Component } from 'react'
import classNames from 'classnames';
import './index.less'

/**
 * 默认支持属性
 * type:string 值为primary，不填为默认
 * defClass:string 默认为tw-btn
 * className:string 自定义class
 * chilren:any 内容，同react
 * onClick:function 点击事件，同react
 * style：object 自定义样式，同react
 * disabled:boolean 禁用按钮的样式
 */
export default class Button extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { type, defClass, className, children, onClick, style, ...other} = this.props;
    const classes = classNames({
      [defClass]: true,
      [`${defClass}-${type}`]: type,
      [className]: className,
    });
    return (
      <button type='button' className={classes} style={style} onClick={onClick} {...other}>{children}</button>
    )
  }
}
// Button.propTypes = {
//   type: PropTypes.string,
//   className: PropTypes.string,
//   onClick: PropTypes.func,
//   style: PropTypes.object,
//   disabled: PropTypes.bool,
// }
Button.defaultProps = {
  defClass: 'tw-btn',
  onClick() {},
  style: {}
}