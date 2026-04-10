import Sortable from 'sortablejs';
import cs from './index.less';

export default class Table extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return (
      <div className={cs.table_container}>
        <div className={`table table-hover table-striped ${className}`}>{children}</div>
      </div>
    );
  }
}

class Header extends PureComponent {
  render() {
    const { children, className = '', fixHeader, data } = this.props;
    return (
      <table
        className={`table table-hover table-striped ${cs['margin-bottom-0']} ${fixHeader &&
          cs['fix_header']} ${className}`}
      >
        <colgroup>{data && data.length && data.map((item, index) => <col key={index} width={item.width} />)}</colgroup>
        <thead className={className}>
          <tr>{children}</tr>
        </thead>
      </table>
    );
  }
}

class Body extends PureComponent {
  componentDidMount() {
    const { sortable, onSort, sortOptions = {} } = this.props;

    if (sortable) {
      const options = {
        draggable: 'tr',
        onSort
      };
      Sortable.create(this.refs.sortable, {
        ...options,
        ...sortOptions
      });
    }
  }

  render() {
    const { children, className = '', data } = this.props;
    return (
      <table className={`table table-hover table-striped ${className}`}>
        <colgroup>{data && data.length && data.map((item, index) => <col key={index} width={item.width} />)}</colgroup>
        <tbody className={className} ref="sortable">
          {children}
        </tbody>
      </table>
    );
  }
}

Table.Header = Header;
Table.Body = Body;
