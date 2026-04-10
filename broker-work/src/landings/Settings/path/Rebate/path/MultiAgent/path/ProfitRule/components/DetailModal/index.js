import i18n from 'utils/i18n';
import { Dialog, Button } from 'lean-ui';

import cs from './DetailModal.less';

export default class DetailModal extends PureComponent {
  render() {
    const { onHide, data } = this.props;

    return (
      <Dialog
        title={i18n['settings.rebate_setting.mt_group_detail']}
        visible={true}
        onCancel={onHide}
        footer={<Button onClick={onHide}>{i18n['general.cancel']}</Button>}
      >
        {' '}
        {data ? (
          data.mt4Groups.length === 1 ? (
            <p>
              {data.mt4Groups[0].groups.length === 0
                ? i18n['settings.rebate_setting.all_group']
                : data.mt4Groups[0].groups.join(', ')}
            </p>
          ) : (
            data.mt4Groups
              .filter(group => parseInt(group.groups[0]) !== -1)
              .map((group, idx) => {
                return (
                  <p key={idx}>
                    {group.serverName}:{' '}
                    {group.groups.length === 0
                      ? i18n['settings.rebate_setting.all_group']
                      : group.groups.join(', ')}
                  </p>
                );
              })
          )
        ) : (
          ''
        )}
      </Dialog>
    );
  }
}
