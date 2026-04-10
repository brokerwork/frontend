import { Button, Input, Form } from 'lean-ui';
import moment from 'moment';
import i18n from 'utils/i18n';
import cs from './index.less';
import ContentCard from '../../../../../components/ContentCard';
import RevisitTime from './RevisitTime';
import ButtonRadio from 'components/v2/ButtonRadio';
import Activities from './Activities';
export default class FollowRecordView extends PureComponent {
  constructor(props) {
    super(props);
    this.resetForm(true);
  }
  handleChange(field, e) {
    let v = e;
    if (e.target) v = e.target.value;
    this.setState({
      [field]: v
    });
  }
  resetForm = initial => {
    const { followWayOptions } = this.props;
    const __state = {
      followWay:
        followWayOptions && followWayOptions[0] && followWayOptions[0].value,
      followContent: '',
      followContentError: false,
      rightTabIndex: 1
    };
    if (initial) {
      this.state = __state;
    } else {
      this.setState(__state);
    }
  };
  removeError(field) {
    this.setState({
      [field]: false
    });
  }
  doAddRecord = () => {
    const {
      customerDetailInfo,
      addFollowRecord,
      getCustomerDetail,
      userInfo: { name },
      searchType,
      getCustomerList
    } = this.props;
    let { ...__d } = this.state;
    const { customerId } = customerDetailInfo;
    if (!__d.followContent.trim()) {
      this.setState({
        followContentError: true
      });
      return;
    }
    __d['creator'] = name;
    __d['followTime'] = moment();
    addFollowRecord(customerId, __d).then(res => {
      if (!res.result) return;
      getCustomerDetail();
      this.resetForm();
      getCustomerList();
    });
  };

  render() {
    const {
      followContent,
      followWay,
      followContentError,
      rightTabIndex
    } = this.state;
    const {
      followWayOptions,
      followUpRecords,
      customerDetailInfo: { enabled },
      versionRights
    } = this.props;
    const hasFollowWayOptions = followWayOptions.length > 0;

    return (
      <div className={cs['follow']}>
        {versionRights['BW_CUSTOMER_FOLLOW'] && (
          <ContentCard>
            <ContentCard.Header
              title={i18n['customer.detail.customer_message']}
              icon="follow-up"
              iconClassName={cs['follow-up']}
            />
            <ContentCard.Body>
              <Form>
                {hasFollowWayOptions ? (
                  <Form.Item className={cs['block-form']}>
                    <Form.Label className={cs['label']}>
                      {i18n['customer.detail.follow_way_label']}
                    </Form.Label>
                    <Form.Control className={cs['control']}>
                      <ButtonRadio
                        onSelect={(data, value) => {
                          this.handleChange('followWay', value);
                        }}
                        disabled={!enabled}
                        code={followWay}
                        data={followWayOptions}
                      />
                    </Form.Control>
                  </Form.Item>
                ) : (
                  undefined
                )}
                <Form.Item className={cs['block-form']}>
                  <Form.Label className={cs['label']}>
                    {i18n['customer.detail.follow_content_label']}
                  </Form.Label>
                  <Form.Control
                    disabled={!enabled}
                    className={cs['control']}
                    error={
                      followContentError
                        ? i18n['customer.detail.follow_content_error']
                        : undefined
                    }
                  >
                    <Input.TextArea
                      className={`${cs['follow-content']} ${
                        followContentError ? cs['error'] : ''
                      }`}
                      value={followContent}
                      componentClass="textarea"
                      disabled={!enabled}
                      onChange={this.handleChange.bind(this, 'followContent')}
                      onFocus={this.removeError.bind(
                        this,
                        'followContentError'
                      )}
                    />
                  </Form.Control>
                </Form.Item>
              </Form>
            </ContentCard.Body>
            <ContentCard.Footer className={cs['bottom']}>
              <div className={cs['foot-bottom']}>
                <Button
                  type="primary"
                  disabled={!enabled}
                  onClick={this.doAddRecord}
                  style={{ marginRight: 10 }}
                >
                  {i18n['general.confirm']}
                </Button>
                <Button
                  type="default"
                  disabled={!enabled}
                  onClick={this.resetForm.bind(this, false)}
                >
                  {i18n['general.cancel']}
                </Button>
              </div>
              <RevisitTime {...this.props} disabled={!enabled} />
            </ContentCard.Footer>
          </ContentCard>
        )}
        <Activities {...this.props} />
      </div>
    );
  }
}
