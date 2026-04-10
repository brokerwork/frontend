import cs from './style.less';
const Loading = () => {
  return (
    <div className={cs['loading']}>
      <div className={cs['loader']}>
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
export default Loading;
