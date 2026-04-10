import { findDOMNode } from 'react-dom';
import PopUpTool from './PopUpTool';
import ColorPicker from 'components/ColorPicker';
import cs from '../Editor.less';
import { COLORS } from '../contants';
const partten = 'FONT_COLOR';
export default class FontColor extends PopUpTool {
  state = {
    show: false
  };
  onChange = value => {
    if (this.change) {
      this.reduceStyle(
        COLORS.map(color => `${partten}_${color}`),
        `${partten}_${value}`,
        this.change.bind(this, `${partten}_${value}`)
      );
    }
    this.togglePop(false);
  };

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    if (editorState && this.props.editorState !== editorState) {
      const currentStyle = editorState.getCurrentInlineStyle();
      const active =
        COLORS.find(color => {
          return currentStyle.has(`${partten}_${color}`);
        }) || false;
      this.setState({
        active
      });
    }
  }
  render() {
    const { data } = this.props;
    const { show, active } = this.state;
    return (
      <div className={cs['tools-item']} style={{ color: active }}>
        <div className="pop-label">
          <i
            className={'fa fa-eyedropper'}
            onClick={this.togglePop.bind(this, undefined)}
          />
        </div>
        {show ? (
          <div className={`${cs['color-pop-box']} ${cs['pop-box']}`}>
            <ColorPicker
              data={data.child}
              onChange={this.onChange}
              className={cs['tools-item']}
            />
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
