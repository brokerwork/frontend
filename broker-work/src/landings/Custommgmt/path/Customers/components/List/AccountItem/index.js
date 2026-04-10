import Tips from 'components/Tips';
import cs from './index.less';
import i18n from 'utils/i18n';
import { Children } from 'react';
import { Popover, Icon } from 'lean-ui';

export class Link extends Component {
  render() {
    const { data, disabled, showTopAlert, children } = this.props;
    return (
      <a
        className={cs['link']}
        onClick={e => {
          if (disabled) {
            e.preventDefault();
            if (showTopAlert) {
              showTopAlert({
                content: i18n['customer.account_link.no_permission']
              });
            }
            return false;
          }

          window.open(
            `/accountmgmt/${data.account}?vendor=${data.vendor}&serverId=${
              data.serverId
            }`
          );
        }}
        // href={`/accountmgmt/${data.account}?vendor=${data.vendor}&serverId=${
        //   data.serverId
        // }`}
        // target="_blank"
      >
        {data.account} {children}
      </a>
    );
  }
}
export default class AccountItem extends Component {
  state = {
    visible: false
  };

  componentWillUnmount() {
    const { onRemoveRef } = this.props;
    onRemoveRef && onRemoveRef();
  }

  onVisibleChange = status => {
    this.setState({
      visible: status
    });
  };
  hidePopover = () => {
    if (this.state.visible) {
      this.setState({ visible: false });
      console.log('ssssssss2');
    }
  };
  render() {
    const {
      data = [],
      disabled,
      showTopAlert,
      limit = 1,
      children
    } = this.props;
    const { visible } = this.state;
    return (
      <span className={cs['links']}>
        {data.map((item, i) => {
          if (i > limit) return;
          else if (i === limit)
            return (
              <Popover
                visible={visible}
                placement="rightTop"
                trigger="click"
                onVisibleChange={this.onVisibleChange}
                getPopupContainer={triger => triger}
                overlayClassName={cs['menu-pop']}
                content={
                  <ul className={cs['tips-box-content']}>
                    {data.map((d, index) => {
                      return (
                        <li key={index}>
                          <Link
                            data={d}
                            disabled={disabled}
                            showTopAlert={showTopAlert}
                          />
                        </li>
                      );
                    })}
                  </ul>
                }
              >
                <Icon className={`main-color`} icon="more" />
              </Popover>
            );
          else
            return (
              <Link
                key={i}
                data={item}
                disabled={disabled}
                showTopAlert={showTopAlert}
                children={children}
              />
            );
        })}
      </span>
    );
  }
}
