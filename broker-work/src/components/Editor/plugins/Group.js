import DefaultTool from './DefaultTool';
import Dropdown from 'components/Dropdown';
import cs from '../Editor.less';

export default class Group extends DefaultTool {
  onChange = tool => {
    const { data: { child } = { child: [] } } = this.props;
    if (tool.type === 'INLINE') {
      this.reduceStyle(
        child.map(item => item.value),
        tool.value,
        this.change.bind(this, tool)
      );
    } else {
      this.change(tool);
    }
  };
  componentWillReceiveProps(newProps) {
    const { editorState, data } = newProps;
    const active = this.getAtiveValue(editorState, data.child);
    this.setState({
      active
    });
  }
  render() {
    const { data } = this.props;
    const { active } = this.state;
    return (
      <Dropdown
        data={data.child}
        value={active}
        onSelect={this.onChange}
        {...data.props}
        customContent={true}
        className={`${cs['tools-item']} ${active ? cs['active'] : ''}`}
      >
        <i className={`fa ${data.icon}`} />
      </Dropdown>
    );
  }
}
