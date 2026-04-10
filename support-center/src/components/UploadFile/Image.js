import cs from './UploadFile.less';

export default class ViewImage extends PureComponent {
  render() {
    const { value, removable, onRemove, previewClassName } = this.props;

    return (
      <div className={`image-value ${cs['image-value']} ${previewClassName}`}>
        <div className={`wrapper ${cs['wrapper']}`}>
          <img src={value} />
          <div className={`actions ${cs['actions']}`}>
            <a href={value} target="_blank" className={`preview-btn ${cs['preview-btn']}`}>
              <i className="fa fa-eye"></i>
            </a>
            {removable
              ? <a onClick={onRemove} className={`remove-btn ${cs['remove-btn']}`}>
                  <i className="fa fa-trash"></i>
                </a>
              : undefined}
          </div>
        </div>
      </div>
    );
  }
}