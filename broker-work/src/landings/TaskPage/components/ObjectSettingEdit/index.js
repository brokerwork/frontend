import { Button, Collapse, Input } from 'lean-ui';
import Tag from 'components/v2/Tag';
import { FormattedMessage } from 'react-intl';
import i18n from 'utils/i18n';
import CardPanel from 'components/v2/CardPanel';
import ObjectSettingEditMemberSelect from '../ObjectSettingMemberSelect';

import cs from './ObjectSettingEdit.less';

export default class ObjectSettingEdit extends PureComponent {
  render() {
    const {
      data,
      stepData,
      getObjectMembers,
      objectMembers,
      objectId,
      serverList,
      showTopAlert,
      saveStepData,
      taskType
    } = this.props;
    const { editId, editStepData } = this.state;
    return (
      <div>
        {!editStepData ? (
          <CardPanel
            onClose={this.onClose}
            show={true}
            title={i18n['task.object_setting.edit_task_group']}
          >
            <div className={cs['basic-info']}>
              <div className={cs['basic-info-item']}>
                <div className={cs['basic-label']}>
                  <span className="required" />
                  {`${i18n['task.object_setting.edit_task_group.group_name']}:`}
                </div>
                <div className={cs['basic-control']}>
                  <Input
                    value={
                      i18n[
                        `task.object_setting.task_setting.task_group_type.${
                          data.jobType
                        }`
                      ]
                    }
                    disabled
                  />
                </div>
              </div>
              <div className={cs['basic-info-item']}>
                <div className={cs['basic-label']}>
                  {`${i18n['task.object_setting.edit_task_group.group_type']}:`}
                </div>
                <div className={cs['basic-control']}>
                  <Input
                    value={
                      i18n[
                        'task.object_setting.edit_task_group.group_type.option_custom'
                      ]
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
            <Collapse forceActiveAll>
              <Collapse.Item
                title={
                  i18n[
                    'task.object_setting.edit_task_group.create_task_panel_title'
                  ]
                }
              >
                {
                  i18n[
                    'task.object_setting.edit_task_group.create_task_panel_title.content'
                  ]
                }
              </Collapse.Item>
              {stepData.map((item, index) => {
                const stepMembers = item.stepUserList;
                const stepMemberSize = stepMembers.length;
                return (
                  <Collapse.Item
                    title={
                      <FormattedMessage
                        id="task.object_setting.edit_task_group.step_title"
                        defaultMessage={
                          i18n['task.object_setting.edit_task_group.step_title']
                        }
                        values={{
                          step: index + 1
                        }}
                      />
                    }
                  >
                    <Input
                      className={cs['stepName']}
                      disabled
                      type="text"
                      value={
                        i18n[
                          `task.object_setting.task_setting.step_name.${
                            data.jobType
                          }`
                        ]
                      }
                    />
                    {editId === item.stepId ? (
                      <div className={cs['step_operation']}>
                        <Tag
                          onClick={this.editStepMember.bind(this, item)}
                          className={cs['editMember']}
                          active
                        >
                          <FormattedMessage
                            id="task.object_setting.edit_task_group.modify_step_member"
                            defaultMessage={
                              i18n[
                                'task.object_setting.edit_task_group.modify_step_member'
                              ]
                            }
                            values={{
                              number: stepMemberSize
                            }}
                          />
                        </Tag>
                        <div className={cs['btns']}>
                          <Button
                            type="primary"
                            onClick={this.edit.bind(this, null)}
                          >
                            {i18n['general.done']}
                          </Button>
                          <Button onClick={this.edit.bind(this, null)}>
                            {i18n['general.cancel']}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={cs['step_operation']}>
                        <div className={cs['step_operation_number']}>
                          {
                            i18n[
                              'task.object_setting.edit_task_group.step_operation_number'
                            ]
                          }: {stepMemberSize}
                        </div>
                        <div className={cs['btns']}>
                          <Button
                            onClick={this.edit.bind(this, item.stepId)}
                            type="primary"
                            className="icon"
                          >
                            <i className="fa fa-pencil" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Collapse.Item>
                );
              })}
            </Collapse>
            <CardPanel.Footer>
              <Button onClick={this.onSave.bind(this, true)} type="primary">
                {i18n['general.save']}
              </Button>
              <Button onClick={this.onClose}>{i18n['general.cancel']}</Button>
            </CardPanel.Footer>
          </CardPanel>
        ) : (
          <ObjectSettingEditMemberSelect
            saveStepData={saveStepData}
            showTopAlert={showTopAlert}
            onClose={this.completeEditMember}
            data={editStepData.stepUserList}
            stepId={editStepData.stepId}
            objectMembers={objectMembers}
            getObjectMembers={getObjectMembers}
            objectId={objectId}
            serverList={serverList}
            taskGroupId={data.categoryId}
            taskType={taskType}
          />
        )}
      </div>
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
      editStepData: null
    };
  }
  completeEditMember = () => {
    const { getStepData, data, objectId } = this.props;
    getStepData(objectId, data.categoryId);
    this.setState({
      editStepData: null,
      editId: null
    });
  };
  componentDidMount() {
    const { getStepData, data, objectId } = this.props;
    getStepData(objectId, data.categoryId);
  }
  edit(id) {
    this.setState({
      editId: id
    });
  }
  onSave = () => {
    this.onClose();
  };
  onClose = type => {
    const { onSave } = this.props;
    onSave(false);
  };
  editStepMember(data) {
    this.setState({
      editStepData: data
    });
  }
}
