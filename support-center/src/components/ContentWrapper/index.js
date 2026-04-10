import cs from "./ContentWrapper.less";

export default class ContentWrapper extends PureComponent {
  render() {
    const { children, header, bodyContentClass, bodyClass } = this.props;

    return (
      <div className={cs["container"]}>
        <div className={cs["header"]}>{header}</div>
        <div className={`${cs["body"]} ${bodyClass || ''}`}>
          <div className={`${cs["body-content"]} ${bodyContentClass || ''}`}>{children}</div>
        </div>
      </div>
    );
  }
}
