import cs from './Breakcrumb.less';

class Breadcrumb extends PureComponent {
  render() {
    const { children, className = '', theme, ...props } = this.props;
    let child = children;
    if (Array.isArray(child)) {
      const __arr = [];
      child.forEach((item, index) => {
        if (index === 0 || !item) {
          __arr.push(item);
        } else {
          __arr.push(
            <i key={index} className={`fa fa-angle-right ${cs['icon']}`} />
          );
          __arr.push(item);
        }
      });
      child = __arr;
    }
    return (
      <div
        className={`${className} ${cs[theme]} ${cs['breadcrumb']}`}
        {...props}
      >
        {child}
      </div>
    );
  }
}

export default Breadcrumb;
