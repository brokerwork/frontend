import * as React from "react"
import * as PropTypes from "prop-types"
import * as classNames from "classnames"
import RcInputNumber from 'rc-input-number'
import Icon from '../Icon'

const prefixCls = "lean-input-number"
const fn = () => { }

export interface InputNumberProps {
    id?: string
    min?: number
    max?: number
    value?: number
    className?: string
    precision?: number
    disabled?: boolean
    placeholder?: string
    defaultValue?: number
    step?: number | string
    style?: React.CSSProperties
    size?: 'large' | 'small' | 'default'
    onKeyDown?: React.FormEventHandler<any>
    parser?: (displayValue: string | undefined) => number
    onChange?: (value: number | string | undefined) => void
    formatter?: (value: number | string | undefined) => string
}

export default class InputNumber extends React.Component<InputNumberProps, any> {
    static defaultProps = {
        step: 1,
    }
    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        precision: PropTypes.number,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        placeholder: PropTypes.string,
        defaultValue: PropTypes.number,
        step: PropTypes.number,
        size: PropTypes.oneOf(["small", "large", "default"]),
        parser: fn,
        onChange: fn,
        formatter: fn,
    }
  
    private inputNumberRef: any
  
    render() {
      const { className, size, ...others } = this.props
      const inputNumberClass = classNames({
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      }, className)
  
        return <RcInputNumber
                prefixCls={prefixCls}
                ref={(c: any) => this.inputNumberRef = c}
                className={inputNumberClass}
                {...others}
            />
    }
  
    focus() {
      this.inputNumberRef.focus()
    }
  
    blur() {
      this.inputNumberRef.blur()
    }
}