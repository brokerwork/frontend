import { Link } from 'react-router-dom';
import cs from './Root.less';
import logoImage from 'assets/images/logo.png';
import LanguageSelector from 'components/LanguageSelector';
import i18n from 'utils/i18n';
import language from 'utils/language';

export default class Root extends PureComponent {
  state = {
    name: '',
    password: '',
    showCode: false,
    currentLang: language.getLang(),
    captchaInstance: null,
    validateData: null
  }

  componentDidMount() {
    const head = document.getElementsByTagName('head')[0];
    const scriptTag = document.createElement('script');

    scriptTag.src = `//cstaticdun.126.net/load.min.js?t=${Date.now()}`;

    head.appendChild(scriptTag);
  }

  onChangeLanguage = (selected) => {
    const { changeLanguage } = this.props;

    changeLanguage(selected.value);
  }

  onChange = (type, evt) => {
    this.setState({
      [type]: evt.target.value
    });
  }

  onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      this.onSubmit();
    }
  }

  captchaInit = () => {
    const { currentLang } = this.state;
    const captchaId = '0c2058677d4149e48181fb30a8b639ac';

    this.setState({
      showCode: true
    }, () => {
      initNECaptcha({
        captchaId,
        element: '#captcha',
        mode: 'float',
        lang: currentLang === 'en-US' ? 'en' : 'zh-CN',
        onVerify: (err, data) => {
          if (!err) {
            this.setState({
              validateData: {
                ...data,
                captchaId
              }
            });
          } else {
            this.setState({
              validateData: null
            });
          }
        }
      }, (instance) => {
        this.setState({
          captchaInstance: instance
        });
      });
    });
  }

  onSubmit = () => {
    const { name, password, captchaInstance, validateData } = this.state;
    const { login } = this.props;
    const info = {
      loginName: name,
      password
    };

    if (validateData) {
      info['neCaptchaDTO'] = validateData;
    }
 
    login(info).then(({ result, data }) => {
      if (data && data.loginFailTimes >= data.showValidateCodeTimes) {
        if (captchaInstance) {
          captchaInstance.refresh();
        } else {
          this.captchaInit();
        }
      } else if (result) {
        window.location.href = `/home?tenantId=${data.tenantId}`;
      }
    });
  }

  render() {
    const { name, password, showCode, currentLang } = this.state;

    return (
      <div className={cs['container']}>
        <div className={cs['box']}>
          <div className={cs['heading']}>
            <div className={cs['logo']}>
              <img src={logoImage} alt="Support Center" />
            </div>
            <LanguageSelector value={currentLang} onChange={this.onChangeLanguage}></LanguageSelector>
          </div>
          <div className={cs['content']}>
            <div className={cs['row']}>
              <input 
                type="text" 
                placeholder={i18n['login.username.placeholder']}
                className={`form-control ${cs['form-control']}`} 
                value={name} 
                onChange={this.onChange.bind(this, 'name')} />
            </div>
            <div className={cs['row']}>
              <input 
                type="password"
                placeholder={i18n['login.password.placeholder']}
                className={`form-control ${cs['form-control']}`} 
                value={password} 
                onChange={this.onChange.bind(this, 'password')}
                onKeyDown={this.onKeyDown} />
            </div>
            {showCode
              ? <div className={cs['row']}>
                  <div id="captcha"></div>
                </div>
              : undefined}
            <div className={`text-right ${cs['row']}`}>
              <Link to="/forgotPassword" className={cs['link']}>
                {i18n['login.forgetpassword.tip']}{i18n['general.question_mark']}
              </Link>
            </div>
            <div className={cs['row']}>
              <button type="button" className={`btn btn-primary ${cs['btn']}`} onClick={this.onSubmit}>{i18n['login.btn.title']}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}