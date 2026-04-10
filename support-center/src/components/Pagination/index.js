class PaginationButton extends PureComponent {
  onClick = () => {
    const { eventKey, onSelect, disabled } = this.props;

    if (!disabled) {
      onSelect(eventKey);
    }
  }
  render() {
    const { children, disabled, active } = this.props;

    return (
      <li className={`${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`} >
        <a onClick={this.onClick}>
          {children}
        </a>
      </li>
    );
  }
}

export default class Pagination extends PureComponent {
  renderPageButtons(
    activePage, items, maxButtons, boundaryLinks, ellipsis, buttonProps
  ) {
    const pageButtons = [];

    let startPage;
    let endPage;

    if (maxButtons && maxButtons < items) {
      startPage = Math.max(
        Math.min(
          activePage - Math.floor(maxButtons / 2, 10),
          items - maxButtons + 1
        ),
        1
      );
      endPage = startPage + maxButtons - 1;
    } else {
      startPage = 1;
      endPage = items;
    }

    for (let page = startPage; page <= endPage; ++page) {
      pageButtons.push(
        <PaginationButton
          {...buttonProps}
          key={page}
          eventKey={page}
          active={page === activePage}
        >
          {page}
        </PaginationButton>
      );
    }

    if (ellipsis && boundaryLinks && startPage > 1) {
      if (startPage > 2) {
        pageButtons.unshift(
          <PaginationButton
            key="ellipsisFirst"
            disabled
            componentClass={buttonProps.componentClass}
          >
            <span>
              {ellipsis === true ? '\u2026' : ellipsis}
            </span>
          </PaginationButton>
        );
      }

      pageButtons.unshift(
        <PaginationButton
          {...buttonProps}
          key={1}
          eventKey={1}
          active={false}
        >
          1
        </PaginationButton>
      );
    }

    if (ellipsis && endPage < items) {
      if (!boundaryLinks || endPage < items - 1) {
        pageButtons.push(
          <PaginationButton
            key="ellipsis"
            disabled
            componentClass={buttonProps.componentClass}
          >
            <span>
              {ellipsis === true ? '\u2026' : ellipsis}
            </span>
          </PaginationButton>
        );
      }

      if (boundaryLinks) {
        pageButtons.push(
          <PaginationButton
            {...buttonProps}
            key={items}
            eventKey={items}
            active={false}
          >
            {items}
          </PaginationButton>
        );
      }
    }

    return pageButtons;
  }

  render() {
    const {
      activePage = 1,
      items = 1,
      maxButtons = 0,
      boundaryLinks = false,
      ellipsis = true,
      first = false,
      last = false,
      prev = false,
      next = false,
      onSelect,
      buttonComponentClass,
      className = ''
    } = this.props;

    const buttonProps = {
      onSelect,
      componentClass: buttonComponentClass,
    };

    return (
      <ul
        className={`pagination ${className}`}
      >
        {first && (
          <PaginationButton
            {...buttonProps}
            eventKey={1}
            disabled={activePage === 1}
          >
            <span>
              {first === true ? '\u00ab' : first}
            </span>
          </PaginationButton>
        )}
        {prev && (
          <PaginationButton
            {...buttonProps}
            eventKey={activePage - 1}
            disabled={activePage === 1}
          >
            <span>
              {prev === true ? '\u2039' : prev}
            </span>
          </PaginationButton>
        )}

        {this.renderPageButtons(
          activePage, items, maxButtons, boundaryLinks, ellipsis, buttonProps
        )}

        {next && (
          <PaginationButton
            {...buttonProps}
            eventKey={activePage + 1}
            disabled={activePage >= items}
          >
            <span>
              {next === true ? '\u203a' : next}
            </span>
          </PaginationButton>
        )}
        {last && (
          <PaginationButton
            {...buttonProps}
            eventKey={items}
            disabled={activePage >= items}
          >
            <span>
              {last === true ? '\u00bb' : last}
            </span>
          </PaginationButton>
        )}
      </ul>
    );
  }
}