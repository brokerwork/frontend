import i18n from 'utils/i18n';
import {PureComponent} from 'react';
import AnimationWrapper from 'components/AnimationWrapper';
import Table from 'components/Table';
import OperateDownloader from '../../containers/OperateDownloader';
import Button from 'components/Button';
import language from "utils/language";

export default class DownloadList extends PureComponent {
  state = {
    showOperateDownloaderModal: false
  }
  editDownloader(downloader){
    const {setEditTargetData} = this.props;
    setEditTargetData(downloader);
    this.setState({
      showOperateDownloaderModal: true
    });
  }

  deleteDownloader(downloader) {
    const { deleteDownloadItemByID ,showTipsModal ,getDownloadList } = this.props;
    showTipsModal({
      header: i18n["common.tips.risk"],
      content: i18n["twapp.download_center.link_delete_confirm_warning"],
      onConfirm: cb => {
        deleteDownloadItemByID(downloader.dlsId).then(res=>{
          getDownloadList()
        });
        cb();
      },
      onCancel: cb => {
        cb();
      }
    });
  }
  toggelModal = (status) => {
    this.setState({
      showOperateDownloaderModal: status
    });
  }
  render() {
    const { downloadList } = this.props;
    
    const {showOperateDownloaderModal} = this.state;
    return (
      <div>
        <div className="actions-bar">
          <div>
            <Button style="primary" onClick={this.toggelModal.bind(this, true)}>
              <i className="fa fa-plus"></i>
              {i18n['twapp.download_center.add_downloader']}
            </Button>
          </div>
        </div>
        <div>
          <Table>
            <Table.Header>
              <th>{i18n['twapp.download_center.label_link_name']}</th>
              <th>{i18n['twapp.download_center.label_link_content']}</th>
              <th>{i18n['twapp.download_center.label_link_address']}</th>
              <th>{i18n['table.header.operation']}</th>
            </Table.Header>
            <Table.Body>
              {downloadList.map((downloader, idx) => {
                return (
                  <tr key={downloader.dlsId}>
                    <td>{downloader.linkNames&&downloader.linkNames[language.getLang()]}</td>
                    <td>{downloader.linkDesces&&downloader.linkDesces[language.getLang()]}</td>
                    <td>{downloader.links&&downloader.links[language.getLang()]}</td>
                    <td>
                      <Button icon style="primary" onClick={this.editDownloader.bind(this, downloader)}>
                        <i className="fa fa-edit"></i>
                      </Button>
                      <Button icon onClick={this.deleteDownloader.bind(this, downloader)}>
                        <i className="fa fa-times"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </Table.Body>
          </Table>
        </div>
        <AnimationWrapper>
          {showOperateDownloaderModal
            ? <OperateDownloader
                onSave={this.toggelModal.bind(this, false)}
                onClose={this.toggelModal.bind(this, false)}/>
            : undefined}
        </AnimationWrapper>
      </div>
    )
  }
}
