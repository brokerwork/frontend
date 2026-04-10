import React, { PureComponent } from 'react';
import cs from './index.less';
import i18n from 'utils/i18n';
import { Icon } from 'lean-ui';

export default class SettingActionBar extends PureComponent {
  render() {
    const { title, children, footer } = this.props;
    return (
      <div className={cs.actionBar}>
        <div className={cs.info}>
          <Icon fontType="bw" icon="setting-color" className={cs.icon} />
          <div>
            <div className={cs.infoLabel}>
              {i18n['settings.left_menu.user_setting']}
            </div>
            <div className={cs.infoTitle}>{title}</div>
          </div>
        </div>
        <div className={cs.actions}>
          {children}
          {footer}
        </div>
      </div>
    );
  }
}
