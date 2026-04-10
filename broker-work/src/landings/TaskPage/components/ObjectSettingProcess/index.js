/**
 * 自定义流程设置页面
 * @file ObjectSettingProcess/index.js
 * @author david
 */
import { NavLink as Link } from 'react-router-dom';
import { Card, Button } from 'lean-ui';
import cs from './ObjectSettingProcess.less';
import { injectReducer } from 'utils/injectReducer';
import { connect } from 'react-redux';
import { actions, reducers } from './control';
import PagePanel from 'components/PagePanel';
import { CardPanelWrapper } from 'components/v2/CardPanel';
import i18n from 'utils/i18n';
import ProcessCardList from '../ProcessCardList';
import ProcessCardEdit from '../ProcessCardEdit';

injectReducer('processList', reducers);

class ObjectSettingProcess extends Component {
  state = {
    pageTitle: '',
    taskType: 'TA',
    editDataIndex: null
  };
  componentDidMount() {
    const {
      match: {
        params: { categoryId, objectId }
      },
      itemName,
      getObjectInfo,
      getProcessListData
    } = this.props;
    this.setState({
      pageTitle: itemName
    });
    getObjectInfo(objectId);
    getProcessListData(categoryId);
  }
  /**
   * 删除单个流程
   * @param {Object} item
   * @param {Number} index
   * */
  handleProcessDelete = index => {
    const { removeData, list } = this.props;
    removeData(index, list);
  };
  /**
   * 编辑单个流程
   * @param {Object} item
   * @param {Number} index
   * */
  handleProcessEdit = (item, index) => {
    this.setState({
      editDataIndex: index,
      editDataType: item
    });
  };
  /**
   * 关闭展开
   * */
  handleCardPanelClose = () => {
    this.setState({
      editDataIndex: null,
      editDataType: null
    });
  };
  /** 复制流程事件 */
  handleCopyProcess = () => {};
  /** 发布 */
  handlePublic = () => {
    const {
      list,
      publicProcess,
      getProcessListData,
      match: { params },
      history
    } = this.props;
    const categoryId = params.categoryId;
    publicProcess(categoryId, list).then(res => {
      if (res.result) {
        // 发布成功后刷新步骤列表
        history.push(`/taskmgmt/objects/${params.objectId}/setting`);
      }
    });
  };
  /**
   * 保存展开数据 回调
   * */
  handleCardPanelSave = (data, stepNum) => {
    const { list, updateData, addData } = this.props;
    const { operation } = this.state.editDataType;
    if (operation === 'edit') {
      updateData(stepNum, data, list);
    } else {
      addData(stepNum, data, list);
    }
    return Promise.resolve({ result: true });
  };
  render() {
    const {
      match: { url },
      location: {
        state: { categoryItem }
      },
      objectInfo,
      list,
      versionRights
    } = this.props;
    const { editDataIndex, editDataType, taskType } = this.state;
    const settingUrl = url.split('/category/')[0];
    const parentUrl = settingUrl.replace('/setting', '');
    return (
      <PagePanel className={cs['container']}>
        <PagePanel.Header className={cs['space-between']}>
          <div className={cs['breadcrumb']}>
            <Link className="main-color main-color-hover" to={parentUrl}>
              {objectInfo.itemName}
            </Link>
            <i className={`fa fa-angle-right ${cs['icon']}`} />
            <Link className="main-color main-color-hover" to={settingUrl}>
              {i18n['task.object_setting']}
            </Link>
            <i className={`fa fa-angle-right ${cs['icon']}`} />
            {
              i18n[
                `task.object_setting.task_setting.task_group_type.${
                  categoryItem.jobType
                }`
              ]
            }
          </div>
          <div className={cs['header-botton-box']}>
            {/* <Button onClick={this.handleCopyProcess}>复制流程设置</Button> */}
            <Button type="primary" onClick={this.handlePublic}>
              {i18n['general.release']}
            </Button>
          </div>
        </PagePanel.Header>
        <PagePanel.Body className={cs['body']}>
          <div className={cs['process-card-wrapper']}>
            {/** 审批流程图 */}
            <ProcessCardList
              data={list}
              objectInfo={objectInfo}
              taskType={taskType}
              handleDelete={this.handleProcessDelete}
              handleEdit={this.handleProcessEdit}
              versionRights={versionRights}
            />
          </div>
        </PagePanel.Body>
        <CardPanelWrapper>
          {/** 添加,或者编辑审批步骤 */}
          {editDataIndex !== null && (
            <ProcessCardEdit
              stepData={list}
              type={editDataType}
              stepNo={editDataIndex}
              objectInfo={objectInfo}
              handleClose={this.handleCardPanelClose}
              handleSave={this.handleCardPanelSave}
            />
          )}
        </CardPanelWrapper>
      </PagePanel>
    );
  }
}

export default connect(
  ({ processList, taskmgmt: { objectDetails }, common: { versionRights } }) => {
    const keys = Object.keys(reducers);
    const { itemName } = objectDetails;
    const props = { itemName };
    keys.forEach(k => {
      props[k] = processList[k];
    });
    return { ...props, versionRights };
  },
  actions
)(ObjectSettingProcess);
