import cs from './Badge.less';
export default ({ children, className = '' }) => (
  <span className={`${cs['container']} ${className}`}>{children}</span>
);
