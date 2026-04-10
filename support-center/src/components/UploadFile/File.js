import cs from './UploadFile.less';
import i18n from 'utils/i18n';

export default class File extends PureComponent {
  render() {
    const { value, removable, onRemove } = this.props;

    return (
      <div className={`file-value ${cs['file-value']}`}>
        <i className={`fa fa-paperclip ${cs['file-icon']}`}></i>
        <a href={value} target="_blank" className={cs['file-link']}>
          {i18n['upload.view_file']}
        </a>
        {removable
          ? <a onClick={onRemove} className={`remove-btn ${cs['remove-btn']}`}>
              <i className="fa fa-times"></i>
            </a>
          : undefined}
      </div>
    );
  }
}