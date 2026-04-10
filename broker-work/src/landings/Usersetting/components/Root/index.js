import { Menu, Icon } from 'lean-ui';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import cs from './index.less';
import { connect } from 'react-redux';
import i18n from 'utils/i18n';

function LeftMenu(props) {
  return (
    <div className={cs['container']}>
      <div className={cs['header']}>
        <Icon fontType="bw" icon="personal-color" />
        {i18n['navigation.personal_center.module_name']}
      </div>
      <div className={cs['content']}>
        <div className={cs['left']}>
          <div className={cs['left-head']}>
            <Image
              src={props.userInfo.headImage}
              height="32"
              width="32"
              className={cs['head-image']}
            />
            <span>{props.userInfo.name}</span>
          </div>
          <Menu
            className={cs['menu']}
            defaultSelectedKeys={['withdraw']}
            selectedKeys={[props.location.pathname.split('/').pop()]}
            mode="inline"
            inlineCollapsed={false}
          >
            <Menu.Item key="withdraw">
              <Link to={`/withdraw`} activeClassName="active">
                <Icon fontType="bw" icon="outgold-outline" />
                {i18n['navigation.user_tools.apply_withdraw']}
              </Link>
            </Menu.Item>
            <Menu.Item key="securitySetting">
              <Link to={`/usersetting/securitySetting`}>
                <Icon fontType="bw" icon="password-outline" />
                {i18n['navigation.user_tools.security_setting']}
              </Link>
            </Menu.Item>
            <Menu.Item key="basicinfo">
              <Link to={`/usersetting/basicinfo`}>
                <Icon fontType="bw" icon="profile-outline" />
                {i18n['navigation.user_tools.user_data']}
              </Link>
            </Menu.Item>
            <Menu.Item key="introduceLink">
              <Link to={`/usersetting/introduceLink`}>
                <Icon fontType="bw" icon="link-outline" />
                {i18n['navigation.user_tools.user_introducelink']}
              </Link>
            </Menu.Item>
            <Menu.Item key="emailsetting">
              <Link to={`/usersetting/emailsetting`}>
                <Icon icon="email-outline" />
                {i18n['navigation.user_tools.email_setting']}
              </Link>
            </Menu.Item>
            <Menu.Item key="personalNotify">
              <Link to={`/personalNotify`}>
                <Icon icon="bell-outline" />
                {i18n['settings.self_notify.header']}
              </Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className={cs['right']}>{props.children}</div>
      </div>
    </div>
  );
}
export default connect(
  ({ common: { userInfo } }) => ({
    userInfo
  }),
  {}
)(LeftMenu);
