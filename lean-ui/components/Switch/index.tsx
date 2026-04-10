import * as React from "react"
import * as PropTypes from "prop-types"
import * as classNames from "classnames"

const prefix = "lean"
const fn = () => { }

export interface SwitchProps {
    checked?: boolean
    disabled?: boolean
    className?: string
    defaultChecked?: boolean
    checkedChildren?: React.ReactNode
    onChange?: React.EventHandler<any>
    unCheckedChildren?: React.ReactNode
}

class Switch extends React.Component<SwitchProps, any> { 
    static defaultProps = {
        onChange: fn,
        className: '',
        disabled: false,
        checkedChildren: '',
        unCheckedChildren: '',
        defaultChecked: false,
    }

    static propTypes = {
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        className: PropTypes.string,
        defaultChecked: PropTypes.bool,
        checkedChildren: PropTypes.element,
        unCheckedChildren: PropTypes.element,
    }

    constructor(props: SwitchProps) { 
        super(props)
        let checked = false
        if ('checked' in props) {
            checked = !!props.checked
        } else {
            checked = !!props.defaultChecked
        }
        
        this.state = { checked }
    }
    
    toggle = () => {
        const { onChange, disabled } = this.props
        if (disabled) return
        const checked = !this.state.checked
        this.setState({
            checked: checked
        })
        onChange(checked)
    }

    componentWillReceiveProps(nextProps: any) {
        if ('checked' in nextProps) {
            this.setState({
                checked: !!nextProps.checked,
            })
        }
    }

    render() { 
        const {
            disabled,
            className,
            checkedChildren,
            unCheckedChildren,
            ...restProps
        } = this.props
        const checked = this.state.checked
        const switchClassName = classNames({
            [className]: !!className,
            [`${prefix}-switch`]: true,
            [`${prefix}-switch-checked`]: checked,
            [`${prefix}-switch-disabled`]: disabled && !checked,
            [`${prefix}-switch-disabled-checked`]: disabled && checked,
        })

        return (
            <span
                {...restProps}
                className={switchClassName}
                onClick={this.toggle}
            >
                <span className={`${prefix}-switch-inner`}>
                    {checked ? checkedChildren : unCheckedChildren}
                </span>
            </span>
        )
    }
}

export default Switch