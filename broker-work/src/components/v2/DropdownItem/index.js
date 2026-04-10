import { NavLink as Link } from 'react-router-dom';
import { findDOMNode } from 'react-dom';
import cs from './DropdownItem.less';

export default class DropdownItem extends PureComponent {
  state = {
    stateShow: false
  };

  componentDidMount() {
    document.addEventListener('click', this.hideDropdown, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown, false);
  }

  hideDropdown = e => {
    if (findDOMNode(this).contains(e.target)) return;
    this.setState({
      stateShow: false
    });
  };

  toggleList = (disable, toggle) => {
    if (disable) return;
    this.setState({
      stateShow:
        toggle === true || toggle === false ? toggle : !this.state.stateShow
    });
  };

  onSelect = item => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(item);
    this.toggleList();
  };

  render() {
    const {
      children,
      className,
      show,
      right,
      data,
      externalMenu,
      onSelect = () => {},
      renderMenuItem,
      hover,
      autoWidth = true
    } = this.props;
    const { stateShow } = this.state;
    let classStr = '';
    if (className) classStr += ` ${className}`;
    if (show || stateShow) classStr += ' open';

    return (
      <div
        className={`${classStr} ${cs['dropdown-container']}`}
        onMouseEnter={this.toggleList.bind(this, !hover, true)}
        onMouseLeave={this.toggleList.bind(this, !hover, false)}
      >
        <div
          className="dropdown-text"
          data-test={this.props['data-test']}
          onClick={this.toggleList.bind(this, hover)}
        >
          {children}
        </div>
        {data || externalMenu ? (
          <ul
            className={`dropdown-menu ${cs['dropdown-menu']} ${right
              ? 'dropdown-menu-right'
              : ''} ${autoWidth ? cs['dropdown-menu-auto-width'] : ''}`}
          >
            {data &&
              data.map((item, index) => {
                return (
                  <li data-test={item.id} key={index} onClick={this.onSelect.bind(this, item)}>
                    {!item.link || item.link === 'javascript:;' ? (
                      <a href="javascript:;" key={index}>
                        {renderMenuItem ? renderMenuItem(item) : item.label}
                      </a>
                    ) : (
                      <Link to={item.link} key={index}>
                        {renderMenuItem ? renderMenuItem(item) : item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            {externalMenu &&
              externalMenu.length !== 0 && (
                <li className={cs['exteranl-menu']} />
              )}
            {externalMenu &&
              externalMenu.length !== 0 &&
              externalMenu.map((item, index) => {
                return (
                  <li key={index} onClick={this.onSelect.bind(this, item)}>
                    {!item.link || item.link === 'javascript:;' ? (
                      <a href="javascript:;" key={index}>
                        {renderMenuItem ? renderMenuItem(item) : item.label}
                      </a>
                    ) : (
                      <Link to={item.link} key={index}>
                        {renderMenuItem ? renderMenuItem(item) : item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
          </ul>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
