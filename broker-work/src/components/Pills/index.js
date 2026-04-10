import cs from './Pills.less';
export default ({ children, className = '' }) => (
  <div className={`${cs['container']} ${className}`}>{children}</div>
);
