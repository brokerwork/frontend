import { Icon } from 'lean-ui';
import cs from './index.less';
export default ({ children, text, className, icon, onClick }) => {
  return (
    <span className={`${cs['button']} main-color`} onClick={onClick}>
      {icon ? <Icon icon={icon} className={cs['icon']} /> : undefined}
      {text}
      {children}
    </span>
  );
};
