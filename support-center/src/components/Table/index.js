import Sortable from 'sortablejs';

export default class Table extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return <table className={`table table-hover table-striped ${className}`}>{children}</table>;
  }
}

class Header extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return (
      <thead className={className}>
        <tr>{children}</tr>
      </thead>
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
    const { children, className = '' } = this.props;

    return (
      <tbody className={className} ref="sortable">
        {children}
      </tbody>
    );
  }
}

Table.Header = Header;
Table.Body = Body;
