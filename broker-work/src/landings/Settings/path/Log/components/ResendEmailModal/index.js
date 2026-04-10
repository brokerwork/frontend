import i18n from 'utils/i18n'
import { Button, Dialog } from 'lean-ui'
import { DropdownForCode } from 'components/v2/Dropdown'

import cs from './ResendEmailModal.less'

export default ({ data, status, value, onHide, onChange, onSubmit }) => {
  return (
    <Dialog
      visible={true}
      onCancel={onHide}
      title={i18n['tipsmodal.title']}
      footer={<div>
        <Button onClick={onSubmit} type="primary">
          {status
            ? i18n['tipsmodal.confirm']
            : i18n['setting.log.message.resend']}
        </Button>
        <Button onClick={onHide}>{i18n['tipsmodal.cancel']}</Button>
      </div>}>
      {`${i18n['setting.log.message.label']}: `}
      <DropdownForCode
        data={data}
        value={value}
        onChange={onChange}
        autoWidth />
      {
        status === 'STATUS_SUCCESS' && <div className={cs['tips-text']}>
          {i18n['setting.log.message.success_tips']}
        </div>
      }
    </Dialog>
  )
}
