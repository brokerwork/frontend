import React from "react";
import DatePicker from "../components/DatePicker";
import { DatePicker as AntDatePicker } from "antd";
import "antd/dist/antd.css";
import { action } from "@storybook/addon-actions";
const { RangePicker, WeekPicker } = DatePicker;
const AntRangePicker = AntDatePicker.RangePicker;
import moment from "moment";
const locale = {
  lang: {
    placeholder: "Select date",
    rangePlaceholder: ["Start date", "End date"],
    today: "Today",
    now: "Now",
    backToToday: "Back to today",
    ok: "Ok",
    clear: "Clear",
    month: "月",
    year: "年",
    timeSelect: "选择时间",
    dateSelect: "Select date",
    monthSelect: "Choose a month",
    yearSelect: "Choose a year",
    decadeSelect: "Choose a decade",
    yearFormat: "YYYY",
    dateFormat: "M/D/YYYY",
    dayFormat: "D",
    dateTimeFormat: "M/D/YYYY HH:mm:ss",
    monthFormat: "MMMM",
    monthBeforeYear: true,
    previousMonth: "Previous month (PageUp)",
    nextMonth: "Next month (PageDown)",
    previousYear: "Last year (Control + left)",
    nextYear: "Next year (Control + right)",
    previousDecade: "Last decade",
    nextDecade: "Next decade",
    previousCentury: "Last century",
    nextCentury: "Next century"
  },
  timePickerLocale: {
    placeholder: "Select time"
  }
};

export default {
  chapters: [
    {
      sections: [
        {
          title: "日期选择器",
          info: "date-picker",
          sectionFn: () => {
            let ranges = {
              最近一周: [moment(), moment().add(7, "days")],
              近30天: [moment().subtract(30, "days"), moment()]
            };
            let renderSidebar = aaa => {
              console.log(aaa);
            };
            return (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <DatePicker locale={locale} showTime={{ format: 'HH:mm' }} />
                  <AntDatePicker showTime={{ format: 'HH:mm' }}  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <AntRangePicker showTime />
                  <RangePicker locale={locale} showTime={{ format: 'H:mm' }} />
                  <div>带快捷选项</div>
                  <RangePicker ranges={ranges} />
                  <div>限制范围</div>
                  <RangePicker disabledDate={current => current > moment()} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <WeekPicker />
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
