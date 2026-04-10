import cs from './Loading.less';

export default class Loading extends PureComponent {
  render() {
    return (
      <div className={cs['container']}>
        <div className={cs['spinner']}>
          <div className={cs['bounce1']}></div>
          <div className={cs['bounce2']}></div>
          <div className={cs['bounce3']}></div>
        </div>
      </div>
    );
  }
}