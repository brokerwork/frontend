import { MENU } from "common/constant";

export default class Iframe extends PureComponent {
  render() {
    const { location, match } = this.props;
    const category = match.path.split("/")[2];
    const currentMenu = MENU.find(item => item.eventKey === category);
    let url = currentMenu.iframeUrl;

    if (!url) {
      const currentSubMenu = currentMenu.subMenu.find(
        item => item.link === location.pathname
      );

      url = currentSubMenu.iframeUrl;
    }

    return (
      <div style={{ padding: "15px" }}>
        <iframe
          src={url}
          style={{ overflow: "auto" }}
          scrolling="yes"
          frameBorder="no"
          width="100%"
          height="100%"
        />
      </div>
    );
  }
}
