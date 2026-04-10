import { FormattedMessage } from 'react-intl';
import cs from './index.less';
import i18n from 'utils/i18n';

const _formatDuplicateNoteItem = (
  field,
  { customer, contact },
  fields,
  type
) => {
  const { customerFormFields, contactFormFields } = fields;
  const names = customer || contact;
  if (!(names && names.length)) return;
  const formFields =
    type === 'customer'
      ? customerFormFields.find(item => item.key === field)
      : contactFormFields.find(item => item.key === field);
  const value = (formFields && formFields.label) || field;
  return (
    <FormattedMessage
      id="customer.duplicate.tips_new.content"
      defaultMessage={i18n['customer.duplicate.tips_new.content']}
      values={{
        field: <b>{value}</b>,
        name: (
          <span className={cs['duplicate-highlight']}>
            {names.join(i18n['general.stop'])}
          </span>
        ),
        role: i18n[`customer.duplicate.tips.${type}`]
      }}
    />
  );
};
const _renderDuplicateMap = (values, fields, type) => {
  const renderLists = [];
  for (let key in values) {
    const duplicateNoteItem = _formatDuplicateNoteItem(
      key,
      values[key],
      fields,
      type
    );
    if (duplicateNoteItem) {
      renderLists.push(<p key={key}>{duplicateNoteItem}</p>);
    }
  }
  return renderLists;
};

export const getDuplicateContent = (duplicateValues, fields, type) => {
  return (
    <article>
      <p>{i18n['customer.duplicate.tips_new.title']}</p>
      {_renderDuplicateMap(duplicateValues, fields, type)}
      <p>{i18n['customer.duplicate.tips_new.is_contunie']}</p>
    </article>
  );
};
