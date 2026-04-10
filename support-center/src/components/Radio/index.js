import cs from './Radio.less';
export default class Radio extends Component {
  onChange = (evt) => {
    const { onChange } = this.props;
    if (onChange) onChange(evt);
  }

  render() {
    const { name, inline, disabled, className, checked, children } = this.props;
    let classStr = '';

    if (className) classStr += ` ${className}`;
    if (inline) classStr += ` ${cs['inline']}`;

    return (
      <label className={`radio ${cs['radio']} ${classStr}`}>
        <input
          disabled={disabled}
          name={name}
          onChange={this.onChange.bind(this, !checked)}
          type="radio"
          checked={checked}
        />
        <i className={`fa ${checked ? 'fa-dot-circle-o' : 'fa-circle-o'}`} />
        {children}
      </label>
    );
  }
}
