export default class FormControl extends PureComponent {
  render() {
    const { type = 'text', className = '' } = this.props;
    const props = {
      ...this.props,
      type,
      className: `form-control ${className}`
    };
    if ('onSearchChange' in props) {
      delete props.onSearchChange;
    }
    return <input {...props} />;
  }
}
