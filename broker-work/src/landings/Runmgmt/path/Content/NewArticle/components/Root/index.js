import PagePanel from 'components/PagePanel';
import UploadFile from 'components/v2/UploadFile';
import Editor, { getHtml } from 'components/Editor';
import i18n from 'utils/i18n';
import cs from './styles.less';
import { Form, Button, Input, Breadcrumb } from 'lean-ui';
import { Link } from 'react-router-dom';

export default class NewArticle extends PureComponent {
  constructor(props) {
    super(props);
    const {
      match: { params }
    } = this.props;
    if (params.id) {
      this.articleId = params.id;
    }
  }
  titleMaxSize = 28;
  state = {
    title: '',
    order: '1',
    image: '',
    content: '',
    errorMsg: new Map()
  };
  cancel = () => {
    const { history } = this.props;
    history.replace('/runmgmt/content/article');
  };
  componentDidMount() {
    const { getArticleById } = this.props;
    if (this.articleId) {
      getArticleById(this.articleId).then(res => {
        if (!res.result) return;
        const { data } = this.props;
        this.setState({
          title: data.title,
          image: data.image,
          content: data.content,
          order: data.order
        });
      });
    }
  }
  onImageChange = v => {
    this.setState({
      image: v
    });
  };
  onTitleChange = e => {
    const v = e.target.value;
    this.setState({
      title: v
    });
  };
  onOrderChange = e => {
    const v = e.target.value;
    !Number.isNaN(Number(v)) &&
      this.setState({
        order: v
      });
  };
  onEditorChange = content => {
    this.setState({ content });
  };
  validate = () => {
    const errorMsg = new Map();
    const { title, image, content } = this.state;
    if (!image) {
      errorMsg.set(
        'image',
        i18n['runmgmt.app_content.new_article.image_error']
      );
    }
    if (!title) {
      errorMsg.set(
        'title',
        i18n['runmgmt.app_content.new_article.title_error']
      );
    }
    if (title.length > 28) {
      errorMsg.set(
        'title',
        i18n['runmgmt.app_content.new_article.placeholder']
      );
    }
    return errorMsg;
  };
  getContentText = content => {
    let str = content;
    if (content.getCurrentInlineStyle) {
      str = getHtml(content);
    }
    const container = document.createElement('div');
    container.innerHTML = str;
    const hasImg = container.getElementsByTagName('img').length > 0;
    return { html: str, text: container.innerText, hasImg };
  };
  onSubmit = () => {
    const errorMsg = this.validate();
    if (errorMsg.size !== 0) {
      this.setState({
        errorMsg
      });
      return;
    }

    let { title, image, content, order } = this.state;
    const { saveArticle, showTopAlert } = this.props;
    // draft content 内容转换为纯文本
    const contentText = this.getContentText(content);
    // 提取摘要
    let summary = contentText.text.replace(/[\r\n]/gi, '');
    summary = summary.substring(0, 400);
    if (summary.replace(/\s+/gi, '').length === 0 && contentText.hasImg) {
      summary = `[${i18n['runmgmt.app_content.column.banner.image']}]`;
    }
    const data = {
      title,
      image,
      order: Number(order),
      summary,
      content: contentText.html
    };
    if (this.articleId) {
      data.id = this.articleId;
    }
    saveArticle(data).then(() => {
      showTopAlert({
        bsStyle: 'success',
        content: i18n['runmgmt.source_setting.add.success']
      });
      this.cancel();
    });
  };
  render() {
    const { content, image, title, errorMsg, order } = this.state;
    return (
      <PagePanel>
        <PagePanel.Header>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={'/runmgmt/content/article'}>
                {i18n['runmgmt.app_content.article.title']}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {!this.articleId
                ? i18n['runmgmt.app_content.article.newArticle']
                : i18n['runmgmt.app_content.new_article.edit_content']}
            </Breadcrumb.Item>
          </Breadcrumb>
        </PagePanel.Header>
        <PagePanel.Body>
          <Form className={cs['form']}>
            <Form.Item col={1} required>
              <Form.Label>
                {i18n['runmgmt.app_content.new_article.image']}
              </Form.Label>
              <Form.Control errorMsg={errorMsg.get('image')}>
                <UploadFile
                  onlyImage={true}
                  value={image}
                  maxHeight={280}
                  uploadSizeLimit={204800}
                  maxWidth={400}
                  onChange={this.onImageChange}
                />
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} required>
              <Form.Label>
                {i18n['runmgmt.app_content.new_article.name']}
              </Form.Label>
              <Form.Control errorMsg={errorMsg.get('title')}>
                <div className={cs['title']}>
                  <Input
                    onChange={this.onTitleChange}
                    value={title}
                    className={`form-control ${cs['titleInput']}`}
                    placeholder={
                      i18n['runmgmt.app_content.new_article.placeholder']
                    }
                  />
                  <div className={cs['titleSizeBox']}>{`${
                    title ? title.length : 0
                  }/${this.titleMaxSize}`}</div>
                </div>
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} required>
              <Form.Label>
                {i18n['runmgmt.app_content.new_article.order']}
              </Form.Label>
              <Form.Control errorMsg={errorMsg.get('order')}>
                <div className={cs['title']}>
                  <Input
                    onChange={this.onOrderChange}
                    value={order}
                    type="number"
                    className={`form-control ${cs['titleInput']}`}
                    placeholder={
                      i18n['runmgmt.app_content.new_article.order.placeholder']
                    }
                  />
                </div>
              </Form.Control>
            </Form.Item>
            <Form.Item col={1}>
              <Form.Label>
                {i18n['runmgmt.app_content.new_article.content']}
              </Form.Label>
              <Form.Control errorMsg={errorMsg.get('content')}>
                <Editor content={content} onChange={this.onEditorChange} />
              </Form.Control>
            </Form.Item>
            <Form.Item className={cs['btns']} col={1}>
              <Button onClick={this.onSubmit} type="primary">
                {i18n['general.save']}
              </Button>
              <Button className={cs['content-button']} onClick={this.cancel}>
                {i18n['general.cancel']}
              </Button>
            </Form.Item>
          </Form>
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
