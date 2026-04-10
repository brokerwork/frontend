import cs from './index.less';
import { Icon, Breadcrumb } from 'lean-ui';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  static defaultProps = {
    menus: []
  };
  render() {
    return (
      <div className={cs['header']}>
        <div>
          <div className={cs['left']}>
            <Icon fontType="bw" icon={'setting'} className={cs['icon']} />
            <div>
              <Breadcrumb>
                {this.props.menus.map(el => {
                  return (
                    <Breadcrumb.Item>
                      {!!el.url ? (
                        <Link to={el.url}>{el.value}</Link>
                      ) : (
                        el.value
                      )}
                    </Breadcrumb.Item>
                  );
                })}
                {!this.props.menus.length && (
                  <Breadcrumb.Item>
                    {i18n['settings.custom_report']}
                  </Breadcrumb.Item>
                )}
              </Breadcrumb>
              <div className={cs['sub-title']}>{this.props.title}</div>
            </div>
          </div>
          {!!this.props.total && (
            <div className={cs['title']}>
              <FormattedMessage
                id="layout.summary.total"
                defaultMessage={i18n['layout.summary.total']}
                values={{
                  value: this.props.total
                }}
              />
              &nbsp;·&nbsp;
              <FormattedMessage
                id="layout.summary.updateTime"
                defaultMessage={i18n['layout.summary.updateTime']}
                values={{
                  value: this.props.time
                }}
              />
            </div>
          )}
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
