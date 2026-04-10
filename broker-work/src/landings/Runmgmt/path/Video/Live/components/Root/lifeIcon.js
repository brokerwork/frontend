import cs from './Root.less';

export default class LifeIcon extends PureComponent {
  render() {
    return (
      <div className={cs['spinner']}>
        <div className={cs['rect1']} />
        <div className={cs['rect2']} />
        <div className={cs['rect3']} />
        <div className={cs['rect4']} />
        <div className={cs['rect5']} />
      </div>
    );
  }
}
