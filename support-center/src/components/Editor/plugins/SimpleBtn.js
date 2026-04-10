import DefaultTool from './DefaultTool';
import cs from '../editor.less';

export default class SimpleBtn extends DefaultTool {
  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    const { data } = this.props;
    if (editorState && this.props.editorState !== editorState) {
      const active = this.getAtiveValue(editorState, [data]);
      this.setState({
        active
      });
    }
  }
  render() {
    const { data } = this.props;
    const { active } = this.state;
    return (
      <span
        className={`${cs['tools-item']} ${active ? cs['active'] : ''}`}
        onClick={this.change.bind(this, data)}
      >
        <i className={`fa ${data.icon}`} />
      </span>
    );
  }
}
