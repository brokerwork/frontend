import cs from './richEditor.less';

export default class StyleButton extends Component {
  onToggle = e => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    const { active, icon, label } = this.props;
    let className = '';
    if (active) {
      className = 'RichEditor-activeButton';
    }

    return (
      <span
        className={`${cs['RichEditor-styleButton']} ${cs[className]}`}
        onMouseDown={this.onToggle}
      >
        {icon ? (
          <i title={label} className={`fa fa-${icon}`}>
            {' '}
          </i>
        ) : (
          label
        )}
      </span>
    );
  }
}
