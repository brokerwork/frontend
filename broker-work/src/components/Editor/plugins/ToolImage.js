import { findDOMNode } from 'react-dom';
import PopUpTool from './PopUpTool';
import UploadFile from 'components/UploadFile';
import { insertImage } from '../utils/entries';
import cs from '../Editor.less';
export default class FontColor extends PopUpTool {
  state = {
    show: false
  };
  onChange = value => {
    let { editorState, onChange } = this.props;
    insertImage(editorState, value, onChange);
    this.togglePop(false);
  };

  render() {
    const { data } = this.props;
    const { show } = this.state;
    return (
      <div className={cs['tools-item']}>
        <div className="pop-label">
          <i
            className={'fa fa-image'}
            onClick={this.togglePop.bind(this, undefined)}
          />
        </div>
        {show ? (
          <div className={`${cs['color-pop-box']} ${cs['pop-box']}`}>
            <UploadFile
              onChange={this.onChange}
              onlyImage={true}
              addHttp={true}
            />
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
