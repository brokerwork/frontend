import * as moment from 'moment';

let currentYear:number = +(moment().year());

export let SalesTargetYears = [
  {value: currentYear, label: currentYear },
  {value: currentYear+1, label: currentYear+1},
  {value: currentYear+2, label: currentYear+2}
]