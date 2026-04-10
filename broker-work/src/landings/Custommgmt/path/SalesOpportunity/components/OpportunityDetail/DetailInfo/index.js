import cs from './index.less';
import i18n from 'utils/i18n';
import moment from 'moment';
import ContentCard from '../../../../../components/ContentCard';
import { Button } from 'lean-ui';
import getFieldValue from 'utils/fieldValue';
import UpdateOpportunityModal from '../../../containers/UpdateOpportunityModal';
const formatStyle = 'YYYY-MM-DD HH:mm:ss';
import { UPDATE_OPPORTUNITY_FORM } from '../../UpdateOpportunityModal/UpdateOpportunityForm';
import { untouch } from 'redux-form';

export default class HeadInfo extends PureComponent {
  state = {
    editing: false,
    hidding: true
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(UPDATE_OPPORTUNITY_FORM);
  };
  onReset = () => {
    const { resetForm } = this.props;
    resetForm(UPDATE_OPPORTUNITY_FORM);
    this.setState({
      editing: false
    });
  };

  updateOpportunity = () => {
    const { getList, getDetail } = this.props;
    this.setState({
      editing: false
    });
    getDetail();
  };
  formatterFormColumns = () => {
    const { formColumns } = this.props;
    const copyData = formColumns.concat();
    return copyData.map(item => {
      if (item.key === 'oweName') {
        item.fieldType = 'text';
      }
      if (item.fieldType !== 'textarea') {
        item.columns = 1;
      }
      return item;
    });
    return copyData;
  };
  render() {
    const {
      canEdit,
      detail,
      detail: { basicinfo = {} }
    } = this.props;
    const { editing } = this.state;
    const formColumns = this.formatterFormColumns();
    return (
      <ContentCard>
        <ContentCard.Header
          icon={'fa  fa fa-user'}
          iconClassName={cs['user']}
          title={i18n['customer.sales_opportunity.detail.detail']}
        >
          {editing || !canEdit ? (
            undefined
          ) : (
            <ContentCard.Tools>
              <div className={`${cs['edit-button']} main-color`}>
                <span
                  className={cs['add-button-link']}
                  onClick={() => {
                    this.setState({
                      editing: true
                    });
                  }}
                >
                  <i className="fa fa-pencil" /> {i18n['general.modify']}
                </span>
              </div>
            </ContentCard.Tools>
          )}
        </ContentCard.Header>
        <ContentCard.Body>
          <UpdateOpportunityModal
            hasContract={detail.contracts && detail.contracts.length}
            info={basicinfo}
            justForm={true}
            disabled={!editing}
            onSave={this.updateOpportunity}
          />
        </ContentCard.Body>
        {editing ? (
          <ContentCard.Footer border min dark>
            <ContentCard.Buttons right>
              <Button type="primary" onClick={this.onSave}>
                {i18n['general.confirm']}
              </Button>
              <Button onClick={this.onReset}>{i18n['general.cancel']}</Button>
            </ContentCard.Buttons>
          </ContentCard.Footer>
        ) : (
          undefined
        )}
      </ContentCard>
    );
  }
}
