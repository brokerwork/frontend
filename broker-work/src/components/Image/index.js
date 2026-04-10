import cs from './Image.less';

export default class Image extends PureComponent {
  render() {
    const { value, className } = this.props;
    return (
      <a
        className={className ? className : cs['container']}
        href={value}
        target="_blank"
      >
        <img src={value} />
      </a>
    );
  }
}
