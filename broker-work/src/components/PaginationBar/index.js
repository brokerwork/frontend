import {
  Pagination,
  Form,
  FormGroup,
  FormControl,
  InputGroup,
  Button
} from 'react-bootstrap';
import Dropdown from '../Dropdown';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { findDOMNode } from 'react-dom';

import cs from './PaginationBar.less';

const formatterPageSize = pageSizes => {
  return pageSizes.map(size => {
    return {
      label: (
        <FormattedMessage
          id="pagination.page_size"
          defaultMessage={i18n['pagination.page_size']}
          values={{ size }}
        />
      ),
      value: size
    };
  });
};

const defaultPageSizeOptions = formatterPageSize([10, 20, 50, 100]);

const _getSizeCustomPageSizeOptions = ({ pageSize, pageSizeOptions }) => {
  if (pageSize) {
    const _pageSizeOptions = pageSizeOptions
      ? formatterPageSize(pageSizeOptions)
      : defaultPageSizeOptions;
    const sizeInpageSizeOptions = _pageSizeOptions.find(
      page => parseInt(pageSize) === parseInt(page.value)
    );
    if (!sizeInpageSizeOptions) {
      return formatterPageSize([pageSize])[0];
    }
  }
};

export default class PaginationBar extends PureComponent {
  constructor(props) {
    super(props);
    const _customSize = _getSizeCustomPageSizeOptions(props);
    this.state = {
      sizeEditing: false,
      customSize: _customSize,
      tempValue: _customSize || ''
    };
  }

  handleSelect = eventKey => {
    const { onPageChange, pageSize } = this.props;
    const pages = {
      pageNo: eventKey,
      pageSize
    };

    onPageChange && onPageChange(pages);
  };

  handlePageSize = selected => {
    const { onPageChange } = this.props;
    const pages = {
      pageNo: 1,
      pageSize: selected.value
    };

    onPageChange && onPageChange(pages);
  };

  handleJumpPage = evt => {
    const { onPageChange, pageSize, total } = this.props;
    const maxPageNo = Math.ceil(total / pageSize);
    const pageNo = Math.min(parseInt(evt.target.value), maxPageNo);
    const pages = {
      pageNo: pageNo,
      pageSize
    };

    if (evt.which === 13) {
      evt.target.value = '';
      onPageChange && onPageChange(pages);
    }
  };

  handleJumpPageChange = evt => {
    const value = evt.target.value.replace(/\D/g, '');

    evt.target.value = value;
  };

  _renderCunstomPageSize = () => {
    const { sizeEditing, customSize, tempValue } = this.state;
    return (
      <div className={cs['external-menu']} onClick={e => e.stopPropagation()}>
        {sizeEditing ? (
          <Form
            className={cs['external-menu-input']}
            onSubmit={this.handleCustomPagesize}
          >
            <InputGroup>
              <FormControl
                className={cs['size-input']}
                onChange={this.customSizeInput}
                value={tempValue}
                type="number"
                min="1"
                max="500"
                ref="customSize"
                required
                placeholder={i18n['pagination.placeholder']}
              />
              <InputGroup.Button>
                <Button type="submit">
                  <i className="fa fa-check" />
                </Button>
                <Button
                  onClick={this.toggleSizeEditing.bind(this, false)}
                  type="button"
                >
                  <i className="fa fa-times" />
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </Form>
        ) : (
          <div
            className={cs['external-menu-item']}
            onClick={this.toggleSizeEditing.bind(this, true)}
          >
            <span>
              {customSize ? customSize.label : i18n['pagination.custom']}
            </span>{' '}
            <i className="fa fa-pencil" />
          </div>
        )}
      </div>
    );
  };
  customSizeInput = e => {
    const tempValue = e.target.value;
    this.setState({
      tempValue
    });
  };

  handleCustomPagesize = e => {
    e.preventDefault();
    const size = parseInt(findDOMNode(this.refs.customSize).value);
    const customSize = formatterPageSize([size])[0];
    this.toggleSizeEditing(false);
    this.setState({
      customSize
    });
    this.handlePageSize(customSize);
    document.body.click();
    return;
  };

  toggleSizeEditing = toggle => {
    const { sizeEditing } = this.state;
    const _toggle = typeof toggle === 'undefined' ? !sizeEditing : toggle;
    setTimeout(() => {
      this.setState({
        sizeEditing: _toggle
      });
    });
  };

  componentWillReceiveProps(nextProps) {
    const { customSize } = this.state;
    const { pageSize } = nextProps;
    if (pageSize) {
      const _customSize = _getSizeCustomPageSizeOptions(nextProps);
      if (
        _customSize &&
        pageSize &&
        (!customSize || (customSize && customSize.value != pageSize))
      ) {
        this.setState({
          customSize: _customSize,
          tempValue: pageSize
        });
      }
    }
  }

  render() {
    const pageSizeOptions = this.props.pageSizeOptions
      ? formatterPageSize(this.props.pageSizeOptions)
      : defaultPageSizeOptions;
    const {
      className,
      simpleMode,
      total = 0,
      pageSize = pageSizeOptions[0].value,
      pageNo = 1
    } = this.props;
    const { customSize } = this.state;
    const items = Math.ceil(total / pageSize) || 1;
    const currentPageSize =
      pageSizeOptions.find(
        page => parseInt(pageSize) === parseInt(page.value)
      ) || customSize;

    return (
      <div className={className ? className : ''}>
        <table className={cs['pagination-bar']}>
          <tbody>
            <tr>
              <td className={cs['page-summary']}>
                <FormattedMessage
                  id="pagination.summary"
                  defaultMessage={i18n['pagination.summary']}
                  values={{
                    total: <span>{total}</span>,
                    pageNo: <span>{pageNo}</span>
                  }}
                />
              </td>
              <td>
                <Pagination
                  className={cs['pagination']}
                  activePage={pageNo}
                  bsSize="small"
                  next
                  prev
                  boundaryLinks
                  items={items}
                  maxButtons={5}
                  onSelect={this.handleSelect}
                />
              </td>
              {!simpleMode && (
                <td className={cs['per-page']}>
                  <Dropdown
                    className={cs['dropdown']}
                    data={pageSizeOptions}
                    value={currentPageSize}
                    onSelect={this.handlePageSize}
                    externalMenu={this._renderCunstomPageSize()}
                  />
                </td>
              )}
              {!simpleMode && (
                <td className={cs['jump-page']}>
                  <FormattedMessage
                    id="pagination.jump_page"
                    defaultMessage={i18n['pagination.jump_page']}
                    values={{
                      input: (
                        <input
                          type="text"
                          className={`form-control ${cs['jump-page-text']}`}
                          onChange={this.handleJumpPageChange}
                          onKeyPress={this.handleJumpPage}
                        />
                      )
                    }}
                  />
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
