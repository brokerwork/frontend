import Modal from 'components/Modal';
import { Button } from 'lean-ui';
import DatePicker from 'components/v2/DatePicker';
import moment from 'moment';
import i18n from 'utils/i18n';
import { dateTimeFormatStyle } from 'utils/config';

import cs from './TimingSendModal.less';

export default class TimingSendModal extends Component {
  state = {
    time: moment(this.props.defaultValue || undefined).add(1, 'hours'),
    minDate: moment()
  };
  onChange = v => {
    this.setState({
      time: v
    });
  };
  onSubmit = () => {
    const { time } = this.state;
    this.props.onSubmit(time);
  };
  render() {
    const { onSubmit, onHide } = this.props;
    const { time, minDate } = this.state;
    return (
      <Modal show={true} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n['message.timing_send']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={cs['container']}>
            <div className={cs['label']}>{`${
              i18n['message.timing_send_label']
            }:`}</div>
            <div className={cs['control']}>
              <DatePicker
                value={time}
                onChange={this.onChange}
                format={dateTimeFormatStyle}
                minDate={minDate}
                showTime
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="primary"
            onClick={this.onSubmit}
            className={cs['submit-button']}
          >
            {i18n['general.apply']}
          </Button>
          <Button type="default" onClick={onHide}>
            {i18n['general.cancel']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
