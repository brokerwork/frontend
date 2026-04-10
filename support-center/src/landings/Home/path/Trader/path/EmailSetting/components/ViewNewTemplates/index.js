import Select from 'components/Select';
import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import cs from './ViewNewTemplates.less';

// 邮件模板列表
export class MailTempList extends PureComponent {
  render() {
    const { newTemplateList, onTempSelect } = this.props;
    return (
      <div className={cs['mail-temp-menu']}>
        {newTemplateList.map(item => (
          <a
            key={item.templateId}
            className={cs['mail-menu-item']}
            onClick={onTempSelect.bind(null, item)}
          >
            {item.title.replace(new RegExp('【Trader Work ?】'), '')}
          </a>
        ))}
      </div>
    );
  }
}

export class MailFrame extends PureComponent {
  componentDidMount() {
    const { template } = this.props;
    this.injectHtml(template);
  }
  componentWillReceiveProps({ template }) {
    this.injectHtml(template);
  }
  injectHtml(template) {
    const frameDoc = window.document.all
      ? this.refs.iframe.contentWindow.document
      : this.refs.iframe.contentDocument;
    frameDoc.open();
    frameDoc.write(template);
    frameDoc.close();
    frameDoc.contentEditable = false;
    frameDoc.designMode = 'on';
  }
  render() {
    return <iframe src={null} frameBorder="0" ref="iframe" />;
  }
}

function MailTempViewFrame({ template }) {
  return (
    <div className={cs['mail-temp-viewer']}>
      {template ? (
        <MailFrame template={template} />
      ) : (
        <div className={cs['no-temp-selected']}>
          <h1>{i18n['email.setting.new_temp_view.view_list_reminder']}</h1>
        </div>
      )}
    </div>
  );
}

export default class Root extends PureComponent {
  state = {
    language: null,
    emailTempHtml: null
  };

  componentDidMount() {
    const { languages, getEmailNewTemplateList } = this.props;
    this.setState({
      language: languages[0].value
    });
    getEmailNewTemplateList(languages[0].value);
  }

  onLanguageChange = langTag => {
    const { languages, getEmailNewTemplateList } = this.props;
    this.setState({
      language: languages.find(language => language.value == langTag).value
    });
    getEmailNewTemplateList(langTag);
    this.setState({
      emailTempHtml: null
    });
  };

  onTempSelect = item => {
    this.setState({
      emailTempHtml: item.content
    });
  };

  _renderHeader = () => {
    const { toggleTempViewer, languages } = this.props;
    const { language } = this.state;
    return (
      <div className={cs['header']}>
        <a
          href="javascript:;"
          className={cs['hleft']}
          onClick={toggleTempViewer}
        >
          <i className="fa fa-angle-left" />{' '}
          {i18n['email.setting.new_temp_view.nav_back']}
        </a>
        <div className={cs['hright']}>
          {i18n['email.setting.new_temp_view.select_language']}：
          <Select
            className={cs['hlang_selector']}
            value={language}
            options={languages}
            onChange={this.onLanguageChange}
          />
        </div>
      </div>
    );
  };

  render() {
    const { emailTempHtml } = this.state;
    const { newTemplateList } = this.props;
    return (
      <ContentWrapper
        header={this._renderHeader()}
        bodyClass={cs['wrapper-body']}
        bodyContentClass={cs['wrapper-content-body']}
      >
        <div className={cs['mail-temp-view-wrapper']}>
          <MailTempList
            newTemplateList={newTemplateList}
            onTempSelect={this.onTempSelect}
          />
          <MailTempViewFrame template={emailTempHtml} />
        </div>
      </ContentWrapper>
    );
  }
}
