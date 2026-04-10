import moment from 'moment';
const formatTime = fields => {
  //副作用，直接处理field
  if (fields) {
    Object.keys(fields).forEach(item => {
      if (moment.isMoment(fields[item])) {
        fields[item] = fields[item].format('YYYY-MM-DD');
      }
    });
  }
};
export default formatTime;
