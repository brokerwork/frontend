import DefaultTool from './DefaultTool';
import Dropdown from 'components/Dropdown';
import cs from '../editor.less';

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

  _renderMenu = (item, idx) => {
    const { active } = this.state;
    const isSelected = item.value == active.value;

    return (
      <li key={idx}>
        <a onClick={this.onChange.bind(this, item)} className={isSelected ? 'active' : ''}>{item.label}</a>
      </li>
    );
  }

  render() {
    const { data } = this.props;
    const { active } = this.state;

    return (
      <Dropdown
        className={`${cs['tools-item']} ${active ? cs['active'] : ''}`}
      >
      <Dropdown.Toggle>
        <i className={`fa ${data.icon}`} />
      </Dropdown.Toggle>
        <Dropdown.Menu>
          <ul className="menu-list">
            {data.child.map(this._renderMenu)}
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
