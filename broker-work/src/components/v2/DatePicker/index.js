import { DatePicker } from 'lean-ui';
import { DATE_PICKER_LOCALE } from './constans';
import cs from './Datepicker.less';

export default ({ ...props }) => {
  if (props.contentHolder) {
    return (
      <div className={cs['container']}>
        {props.contentHolder}
        <DatePicker {...props} locale={DATE_PICKER_LOCALE} />
      </div>
    );
  } else {
    return <DatePicker {...props} locale={DATE_PICKER_LOCALE} />;
  }
};
