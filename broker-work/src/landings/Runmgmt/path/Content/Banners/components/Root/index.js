import PagePanel from 'components/PagePanel';
import UploadFile from 'components/v2/UploadFile';
import i18n from 'utils/i18n';
import { Button, Breadcrumb, Form, Collapse } from 'lean-ui';
import { Link } from 'react-router-dom';
const Panel = Collapse.Item;
import cs from './Root.less';

// 空白banner
const emptyBannerCreator = () => {
  return { source: '', jumpUrl: '' };
};

export default class Banners extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    let d =
      columns.length &&
      columns.find(item => item.code === 'INFO_ARTICLE').banners;
    if (!Array.isArray(d)) {
      d = [emptyBannerCreator()];
    }
    this.state = {
      data: d,
      errorMsg: new Map()
    };
  }
  componentDidMount() {
    const { getColumns } = this.props;
    getColumns().then(res => {
      if (res.result) {
        const { columns } = this.props;
        let d =
          columns.length &&
          columns.find(item => item.code === 'INFO_ARTICLE').banners;
        if (!Array.isArray(d)) {
          d = [emptyBannerCreator()];
        }
        this.setState({
          data: d,
          errorMsg: new Map()
        });
      }
    });
  }
  addBanner = () => {
    const { data } = this.state;
    const d = data.concat();
    d.push(emptyBannerCreator());
    this.setState({
      data: d
    });
  };
  removeBanner = i => {
    const { data } = this.state;
    const d = data.filter((item, index) => {
      return index !== i;
    });
    // 保证至少有一条可添加的
    if (d.length === 0) {
      d.push(emptyBannerCreator());
    }
    this.setState({ data: d });
  };
  onSave = () => {
    const { editColumnBanners, getColumns, columns } = this.props;
    const { data } = this.state;
    const propsData = columns.find(item => item.code === 'INFO_ARTICLE');
    const errorMsg = new Map();
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const { jumpUrl } = item;
        if (!jumpUrl) return;
        if (jumpUrl.indexOf('http') !== 0) {
          errorMsg.set(
            index,
            i18n['runmgmt.app_content.column.banner.jumbUrl.error']
          );
        }
      });
    }
    if (errorMsg.size > 0) {
      this.setState({
        errorMsg
      });
      return;
    }
    editColumnBanners({
      banners: data,
      code: propsData.code
    }).then(r => {
      if (!r.result) return;
      this.quiteBannersView();
      getColumns();
    });
  };
  modifyBanners = (index, field, e) => {
    const { data } = this.state;
    const d = data.concat();
    const item = d[index];
    if (!item) return;
    const v = e.target ? e.target.value : e;
    item[field] = v;
    this.setState({
      data: d
    });
  };
  quiteBannersView = () => {
    const { updateCurrentSelectColumn } = this.props;
    updateCurrentSelectColumn(null);
  };
  render() {
    const { data, errorMsg } = this.state;
    return (
      <PagePanel>
        <PagePanel.Header>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={'/runmgmt/content/column'}>
                {i18n['navigation.runmgmt.content.column']}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {i18n['runmgmt.app_content.column.columnmgmt_title']}
            </Breadcrumb.Item>
          </Breadcrumb>
        </PagePanel.Header>
        <PagePanel.Body className={cs['container']}>
          {data &&
            data.map((item, index) => {
              return (
                <Collapse bordered={false} defaultActiveKey={['0']}>
                  <Panel
                    key={index}
                    title={`${
                      i18n['runmgmt.app_content.column.banner.subtitle']
                    }0${index + 1}`}
                  >
                    {index !== 0 && (
                      <div className={cs['headerCloseBox']}>
                        <i
                          onClick={this.removeBanner.bind(this, index)}
                          className={`fa fa-times ${cs['close']}`}
                        />
                      </div>
                    )}
                    <Form>
                      <Form.Item col={2}>
                        <Form.Label>{`${
                          i18n['runmgmt.app_content.column.banner.image']
                        }: `}</Form.Label>
                        <Form.Control>
                          <UploadFile
                            maxHeight={560}
                            maxWidth={1380}
                            value={item.source}
                            uploadSizeLimit={1048576}
                            onChange={this.modifyBanners.bind(
                              this,
                              index,
                              'source'
                            )}
                            onlyImage={true}
                          />
                        </Form.Control>
                      </Form.Item>
                      <Form.Item col={2}>
                        <Form.Label>{`${
                          i18n['runmgmt.app_content.column.banner.link']
                        }：`}</Form.Label>
                        <Form.Control error={errorMsg.get(index)}>
                          <input
                            type="text"
                            value={item.jumpUrl}
                            onChange={this.modifyBanners.bind(
                              this,
                              index,
                              'jumpUrl'
                            )}
                            className={'form-control'}
                          />
                        </Form.Control>
                      </Form.Item>
                    </Form>
                  </Panel>
                </Collapse>
              );
            })}
          {data.length < 5 && (
            <div className={cs['more']}>
              <Button onClick={this.addBanner}>
                {i18n['runmgmt.app_content.column.banner.more']}
              </Button>
            </div>
          )}
          <div className={cs['btns']}>
            <Button type="primary" onClick={this.onSave}>
              {i18n['general.save']}
            </Button>
            <Button className={cs['focus']} onClick={this.quiteBannersView}>
              {i18n['general.cancel']}
            </Button>
          </div>
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
