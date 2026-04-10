import cs from './ContentWrapper.less';

export default class ContentWrapper extends PureComponent {
  render() {
    return <div className={cs['content-wrapper']}>{this.props.children}</div>;
  }
}
