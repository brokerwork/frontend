import Modal from 'components/Modal';
import i18n from 'utils/i18n';

import cs from './DetailModal.less';

export default class DetailModal extends PureComponent {
  render() {
    const { show, onHide, data } = this.props;

    return (
      <Modal backdrop="static" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['settings.rebate_setting.mt_group_detail']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
    );
  }
}
