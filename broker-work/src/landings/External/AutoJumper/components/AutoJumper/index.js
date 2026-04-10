import URLSearchParams from 'utils/queryString';
import i18n from 'utils/i18n';

export default class AutoJumper extends Component {
  componentDidMount() {
    const { replace, login, location, getBrandInfo } = this.props;
    if (location.search) {
      const params = URLSearchParams(this.props.location.search);
      const url = decodeURI(params.get('targetUrl'));
      const password = params.get('password');
      const loginName = params.get('loginName');
      getBrandInfo().then(() => {
        login({
          password: password,
          loginName: loginName
        }).then(() => {
          if (url) {
            replace(url);
          }
        });
      });
    }
  }
  render() {
    return <div id="auto-jumper">{i18n['external.autojumper']}...</div>;
  }
}
