import cs from './UploadFile.less';
import i18n from 'utils/i18n';

export default class Uploading extends PureComponent {
  render() {
    const { type, progress, onAbort } = this.props;
    const className = type === 'image' ? cs['image-uploading'] : cs['file-uploading'];

    return (
      <div className={`uploading ${className}`}>
        <span className={`uploading-text ${cs['uploading-text']}`}>
          {i18n['general.uploading']}
        </span>
        <span className={`progress ${cs['progress']}`} style={{width: progress}}></span>
        <a className={`abort-btn ${cs['abort-btn']}`} onClick={onAbort}>
          <i className="fa fa-times"></i>
        </a>
      </div>
    );
  }
}