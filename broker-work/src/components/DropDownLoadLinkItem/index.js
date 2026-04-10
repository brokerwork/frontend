import { MenuItem } from 'react-bootstrap';
import cs from './DropDownLoadLinkItem.less';

export default class DropDownLoadLinkItem extends PureComponent {
  state = {
    stateShow: false
  };

  componentDidMount() {
    document.addEventListener('click', this.hideDropdown, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown, false);
  }

  hideDropdown = () => {
    this.setState({
      stateShow: false
    });
  };

  toggleSubmenu = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      stateShow: !this.state.stateShow
    });
  };

  render() {
    const {
      children,
      className,
      show,
      right,
      submenu,
      submenuClick = () => {}
    } = this.props;
    const { stateShow } = this.state;
    let classStr = '';
    if (className) classStr += ` ${className}`;
    if (show || stateShow) classStr += ` open`;

    return (
      <div className={`${classStr} ${cs['dropdown-container']}`}>
        <div className="dropdown-text" onClick={this.toggleSubmenu}>
          {children}
        </div>
        {submenu ? (
          <ul className={`dropdown-menu ${right ? 'dropdown-menu-right' : ''}`}>
            {submenu.map((item, index) => {
              return (
                <MenuItem
                  onClick={submenuClick}
                  key={index}
                  href={item.link ? item.link : 'javascript:;'}
                  download
                >
                  {item.label}
                </MenuItem>
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
