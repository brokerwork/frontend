import { Pagination } from 'react-bootstrap';
import cs from './Pager.less';

export default class Pager extends PureComponent {
  render() {
    const { maxButtons = 5, className = '', ...otherProps } = this.props;

    return (
      <div className={cs['pager-container']}>
        <Pagination
          prev={<span className={`fa fa-angle-left ${cs['arrow']}`} />}
          next={<span className={`fa fa-angle-right ${cs['arrow']}`} />}
          ellipsis
          bsSize="small"
          maxButtons={5}
          className={`${cs['pager']} ${className}`}
          {...otherProps}
        />
      </div>
    );
  }
}
