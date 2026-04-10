// <EditorForHtml value={value} onChange={onchange} onBlur={onBlur} />
// 对Editor进行包装
// 内部处理onChange与editorState的联动
// 对外暴露onChange事件携带编辑内容的字符串参数
// 适用于reduxForm Field component的格式

import Editor, { getHtml } from 'components/Editor';

export default class EditorForHtml extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: props.value
    };
  }
  onChange = editorState => {
    const { onChange } = this.props;
    this.setState({ editorState }, () => {
      const contentState = editorState.getCurrentContent();
      if (onChange) {
        let html = '';
        //不直接getHtml 添加判断 将<p><br/></p>之类的html视为空字符
        //便于isRequired的验证
        if (contentState.hasText()) {
          html = getHtml(editorState);
        }
        onChange(html);
      }
    });
  };
  render() {
    const { editorState } = this.state;
    const { onBlur } = this.props;
    return (
      <Editor content={editorState} onChange={this.onChange} onBlur={onBlur} />
    );
  }
}
