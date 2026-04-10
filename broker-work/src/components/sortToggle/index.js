import cs from './index.less';

export default class SortToggle extends Component {
  modifySort = () => {
    const {
      onChange,
      sortKey,
      activeSort,
      activeOrder,
      orders = ['DESC', 'ASC'],
      disabled,
      clearable
    } = this.props;
    if (disabled) return;
    if (clearable && sortKey === activeSort && activeOrder === orders[1]) {
      onChange('', '');
      return;
    }
    const newOrder =
      sortKey === activeSort && typeof activeOrder !== 'undefined'
        ? orders.find(item => item !== activeOrder)
        : orders[0];
    if (onChange) {
      onChange(sortKey, newOrder);
    }
  };
  render() {
    const {
      children,
      activeSort,
      sortKey,
      activeOrder,
      orders = ['DESC', 'ASC'],
      disabled
    } = this.props;
    return (
      <span className={cs['sort-text']} onClick={this.modifySort}>
        {children}
        {disabled ? (
          undefined
        ) : (
          <span className={`${cs['sort-icon']}`}>
            <i
              className={`fa fa-sort-asc ${
                activeSort === sortKey && activeOrder === orders[1]
                  ? cs['active']
                  : ''
              }`}
            />
            <i
              className={`fa fa-sort-desc ${
                activeSort === sortKey && activeOrder === orders[0]
                  ? cs['active']
                  : ''
              }`}
            />
          </span>
        )}
      </span>
    );
  }
}
