import cs from './ProgressStatusBar.less';

export default class ProgressStatusBar extends PureComponent {
  onChange = (item, isActive) => {
    const { onChange, disabled } = this.props;

    if (disabled) return;

    onChange && onChange(item);
  };

  render() {
    const { data, value, disabled, className = '' } = this.props;
    const activeIdx = data.findIndex(item => item.value == value);

    return (
      <ul
        className={`${cs['progress-bar']} ${className} ${disabled
          ? cs['disabled']
          : ''}`}
      >
        {data.map((item, idx) => {
          const isActive = idx <= activeIdx;

          return (
            <li key={idx} className={isActive ? cs['active'] : ''}>
              <a onClick={this.onChange.bind(this, item, isActive)}>
                {/* {isActive ? (
                  <i className={`fa fa-check ${cs['finish-icon']}`} />
                ) : (
                  undefined
                )} */}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}
