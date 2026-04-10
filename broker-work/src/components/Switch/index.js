import cs from './index.less';

export default class Switch extends Component {
  render() {
    const { disabled, checked } = this.props;
    const style = checked ? 'right' : 'left';
    return (
      <span
        className={`${cs['c-switch']} ${cs[style]} ${disabled
          ? cs['disabled-style']
          : ''}`}
        onClick={this.props.onSwitch}
      >
        <span className={`${cs['inner']}`} />
      </span>
    );
  }
}
