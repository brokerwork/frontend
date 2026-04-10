import i18n from 'utils/i18n';
import cs from './style.less';

export default function Tips() {
  return (
    <div className={cs.tips}>
      <p>{i18n['user_setting.double_auth.tip1']}</p>
      <p>{i18n['user_setting.double_auth.tip2']}</p>
      <h5>{i18n['user_setting.double_auth.install']}</h5>
      <ul className={`clearfix ${cs.apps}`}>
        <li className={`${cs.android} ${cs.item}`}>
          <div className={cs.logo} />
          <div className={cs.content}>
            <h5>{i18n['user_setting.double_auth.install.andriod']}</h5>
            {i18n['user_setting.double_auth.install.andriod.tip']}
          </div>
        </li>
        <li className={`${cs.ios} ${cs.item}`}>
          <div className={cs.logo} />
          <div className={cs.content}>
            <h5>{i18n['user_setting.double_auth.install.ios']}</h5>
            {i18n['user_setting.double_auth.install.ios.tip']}
          </div>
        </li>
      </ul>
    </div>
  );
}
