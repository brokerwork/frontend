export default class Butotn extends PureComponent {
  render() {
    const { 
      type = 'button',
      children, 
      style = 'default', 
      className = '', 
      icon = false,
      disabled,
      ...otherProps
    } = this.props;

    return (
      <button 
        {...otherProps}
        type={type}
        disabled={disabled}
        className={`btn btn-${style} ${icon ? 'icon' : '' } ${disabled ? 'disabled' : ''} ${className}`} 
      >
        {children}
      </button>
    );
  }
}