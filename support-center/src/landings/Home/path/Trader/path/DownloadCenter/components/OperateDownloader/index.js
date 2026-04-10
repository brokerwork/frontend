import CardPanel from 'components/CardPanel';
import LinkForm, { EMAIL_FORM } from '../Forms';
import i18n from 'utils/i18n';
import cs from './OperateEmail.less';
import Button from 'components/Button';
import { DOWNLOADER_FORM } from '../../controls/actions';

export default class OperateEmail extends PureComponent {
  state = {
    values: this.props.editDownloaderTarget || {}
  };

  onSave = () => {
    const { submitForm } = this.props;
    // 触发表单提交事件
    submitForm(DOWNLOADER_FORM);
  };

  onSubmit = values => {
    const { onSave, operateDownloadItem, showTopAlert, getDownloadList, setEditTargetData } = this.props;
    const {
      brandInfo: { languages }
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(values));
    const required = languages.some(el => {
      return !!copyData.linkDesces[el.value] && !!copyData.linkNames[el.value] && !!copyData.links[el.value];
    });
    if (!required) {
      showTopAlert({
        style: 'danger',
        content: i18n['twapp.download_center.link.required']
      });
      return;
    }
    operateDownloadItem(values).then(({ result }) => {
      if (result) {
        getDownloadList();
        // 置空
        setEditTargetData(null);
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        getDownloadList();
        setEditTargetData(null);
        onSave();
      }
    });
  };

  render() {
    const {
      brandInfo: { languages }
    } = this.props;
    const { onClose } = this.props;
    const { values } = this.state;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>
          {values.id ? i18n['twapp.download_center.edit_downloader'] : i18n['twapp.download_center.add_downloader']}
        </CardPanel.Header>
        <CardPanel.Body className={cs['body']}>
          <div className={cs['form']}>
            <LinkForm initialValues={values} onSubmit={this.onSubmit} languages={languages} />
          </div>
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['app.btn.save']}
          </Button>
          <Button onClick={onClose}>{i18n['app.btn.cancel']}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
