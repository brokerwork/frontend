import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Button, Form } from 'lean-ui';
import ContentCard from '../../../../../components/ContentCard';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from './index.less';

export const FOLLOW_RECORD_FORM = 'CUSTOMER_OPPORTUNITY_FOLLOW_RECORD_FORM';

const sumbit = values => {
  if (required(values.followContent)) {
    throw new SubmissionError({
      followContent: required(values.followContent)(
        i18n['customer.sales_opportunity.follow_record.follow_content']
      )
    });
  }

  return values;
};

export class FollowRecordForm extends PureComponent {
  render() {
    const { handleSubmit, reset, canEdit } = this.props;

    return (
      <div>
        <ContentCard.Body>
          <Form horizontal className={cs['form']}>
            <Form.Item className={cs['block-form']}>
              <div style={{fontSize: 12,marginBottom: 5}}>
                {
                  i18n[
                    'customer.sales_opportunity.follow_record.follow_content_label'
                  ]
                }
              </div>
              <Form.Control className={cs['control']}>
                <Field
                  name="followContent"
                  component={renderField}
                  className={cs['textarea']}
                  colClassName={cs['textarea-col']}
                  columns={12}
                  disabled={!canEdit}
                  type="textareaField"
                />
              </Form.Control>
            </Form.Item>
          </Form>
        </ContentCard.Body>
        <ContentCard.Footer border dark min>
          <div className={cs['foot-bottom']}>
            <Button
              type="primary"
              onClick={handleSubmit(sumbit)}
              disabled={!canEdit}
            >
              {i18n['customer.sales_opportunity.follow_record.confirm']}
            </Button>
            <Button onClick={reset} disabled={!canEdit}>
              {i18n['customer.sales_opportunity.follow_record.cancel']}
            </Button>
          </div>
        </ContentCard.Footer>
      </div>
    );
  }
}

export default reduxForm({
  form: FOLLOW_RECORD_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  }
})(FollowRecordForm);
