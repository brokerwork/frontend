import Result from '../../containers/Result';
import cs from './index.less';
export default class Root extends PureComponent {
  render() {
    return (
      <div className={cs['root']}>
        <Result {...this.props} />
      </div>
    );
  }
}
