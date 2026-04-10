import { connect } from "react-redux";
import { showTopAlert, changeLanguage, logout } from "common/actions";
import cs from "./Container.less";
import defaultImage from "assets/images/default.png";
import logoImage from "assets/images/logo.png";
import LanguageSelector from "components/LanguageSelector";
import Dropdown from "components/Dropdown";
import language from "utils/language";
import i18n from "utils/i18n";
import { Link } from "react-router-dom";
import { getTenantId } from "utils/tenantInfo";

class Header extends PureComponent {
  logout = () => {
    const { logout } = this.props;

    logout().then(({ result }) => {
      if (result) {
        window.location.href = "/";
      }
    });
  };

  onChangeLanguage = selected => {
    const { changeLanguage } = this.props;

    changeLanguage(selected.value);
  };

  render() {
    const currentLang = language.getLang();
    const { tenantInfo } = this.props;

    return (
      <div className={cs["header"]}>
        <div className={cs["logo"]}>
          <a href="/home">
            <img src={logoImage} alt="logo" />
          </a>
        </div>
        <div className={cs["tools-bar"]}>
          <a
            href="http://wpa.qq.com/msgrd?v=3&uin=800190193&site=qq&menu=yes"
            target="_blank"
            className={cs["link"]}
          >
            {i18n["top.support.title"]}
          </a>
          <Dropdown right>
            <Dropdown.Toggle className={cs["profile-toggle"]}>
              <img
                src={defaultImage}
                width="30"
                height="30"
                className={cs["image"]}
              />
              <span className={cs["text"]}>{tenantInfo.tenantName}</span>
              <i className={`fa fa-angle-down ${cs["arrow"]}`} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <ul className="menu-list">
                <li>
                  <Link
                    to={{
                      pathname: "/modifyPassword",
                      search: `?tenantId=${getTenantId()}`
                    }}
                  >
                    {i18n["top.menu.modifypassword"]}
                  </Link>
                </li>
                <li>
                  <a onClick={this.logout}>{i18n["top.menu.logout"]}</a>
                </li>
              </ul>
            </Dropdown.Menu>
          </Dropdown>
          <LanguageSelector
            value={currentLang}
            onChange={this.onChangeLanguage}
            className={cs["language-selector"]}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ common }) => ({
    tenantInfo: common.tenantInfo
  }),
  {
    showTopAlert,
    changeLanguage,
    logout
  }
)(Header);
