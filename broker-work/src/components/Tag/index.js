import cls from 'utils/class';
import cs from './Tag.less';

const fn = () => {};

export default ({
  children,
  disabled,
  bsSize = '',
  bsStyle = '',
  active,
  className,
  onClick
}) => {
  return (
    <span
      className={cls`${cs['tag']}
            ${bsStyle ? cs[bsStyle] : ''}
            ${bsSize ? cs[bsSize] : ''}
            ${className ? className : ''}
            ${active ? cs['active'] : ''}
            ${disabled ? cs['disabled'] : ''}`}
      onClick={!disabled && onClick ? onClick : fn}
    >
      {children}
    </span>
  );
};
