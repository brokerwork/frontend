import Pagination from 'components/Pagination';
import Button from 'components/Button';
import Select from 'components/Select';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import cs from './PaginationBar.less';

const formatterPageSize = (pageSizes) => {
  return pageSizes.map((size) => {
    return {
      label: <FormattedMessage 
        id="pagination.page_size" 
        defaultMessage={i18n['pagination.page_size']} 
        values={{ size }} 
      />,
      value: size
    };
  });
};

const defaultPageSizeOptions = formatterPageSize([10, 20, 50, 100]);


export default class PaginationBar extends PureComponent {
  handleSelect = (eventKey) => {
    const { onPageChange, pageSize } = this.props;
    const pages = {
      pageNo: eventKey,
      pageSize
    };

    if (onPageChange) onPageChange(pages);
  }

  handlePageSizeChange = (pageSize) => {
    const { onPageChange } = this.props;
    const pages = {
      pageNo: 1,
      pageSize
    };

    if (onPageChange) onPageChange(pages);
  }

  handleJumpPage = (evt) => {
    const { onPageChange, pageSize, total } = this.props;
    const maxPageNo = Math.ceil(total / pageSize);
    const pageNo = Math.min(parseInt(evt.target.value), maxPageNo);
    const pages = {
      pageNo: pageNo,
      pageSize
    };

    if (evt.which === 13) {
      evt.target.value = '';
      if (onPageChange) onPageChange(pages);
    }
  }

  handleJumpPageChange = (evt) => {
    const value = evt.target.value.replace(/\D/g, '');

    evt.target.value = value;
  }

  render() {
    const pageSizeOptions = this.props.pageSizeOptions ? formatterPageSize(this.props.pageSizeOptions) : defaultPageSizeOptions;
    const {
      className,
      total = 0,
      pageSize = pageSizeOptions[0].value,
      pageNo = 1
    } = this.props;
    const items = Math.ceil(total / pageSize) || 1;

    return (
      <div className={className ? className : ''}>
        <table className={cs['pagination-bar']}>
          <tbody>
            <tr>
              <td className={cs['page-summary']}>
                <FormattedMessage
                  id="pagination.summary"
                  defaultMessage={i18n['pagination.summary']}
                  values={{ total: <span>{total}</span>, pageNo: <span>{pageNo}</span> }} />
              </td>
              <td>
                <Pagination
                  className={cs['pagination']}
                  activePage={pageNo}
                  next
                  prev
                  boundaryLinks
                  items={items}
                  maxButtons={5}
                  onSelect={this.handleSelect}
                />
              </td>
              <td className={cs['per-page']}>
                <Select
                  className={cs['select']}
                  value={pageSize}
                  onChange={this.handlePageSizeChange}
                  options={pageSizeOptions}
                ></Select>
              </td>
              <td className={cs['jump-page']}>
                <FormattedMessage
                  id="pagination.jump_page"
                  defaultMessage={i18n['pagination.jump_page']}
                  values={{ input: (<input type="text" className={`form-control ${cs['jump-page-text']}`} onChange={this.handleJumpPageChange} onKeyPress={this.handleJumpPage} />) }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
