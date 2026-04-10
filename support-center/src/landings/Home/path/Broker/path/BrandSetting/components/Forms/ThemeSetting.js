import {Field} from 'redux-form';
import FormField from 'components/FormField';
import {required, isEmail} from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import cs from './Forms.less';
import Radio from 'components/Radio';

import checkPick from 'assets/images/checked.png';

const renderThemePicker = ({themeList, input}) => {
  const onChange = themeId => {
    input.onChange(themeId);
  };


  return (
    <div className={cs['theme-picker']}>
      {themeList.map((item, index) => {
        return (
          <div key={index}>
            <div className={cs['theme-fill']}
                 style={{backgroundColor: item.colorValue}}
                 onClick={onChange.bind(this, item.themeId)}>
              {input.value === item.themeId ?
                <img className={cs['theme-check']} src={checkPick}/> : undefined}
            </div>
            <div className={cs['theme-label']}>
              <a
                href={item.previewUrl}
                target="_blank"
              >{i18n['brand.setting.theme.preview']}</a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export class ThemeSetting extends PureComponent {

  render() {

    const {themeList} = this.props;

    return (
      <div className={cs['formSection']}>
        <div className={cs['formSectionTile']}>{i18n['brand.setting.theme.title']}</div>
        <div className={cs['formSectionBody']}>
          <Form.Item>
            <Form.Control>
              <Field
                name="themeId"
                themeList={themeList}
                component={renderThemePicker}
              />
            </Form.Control>
          </Form.Item>
        </div>
      </div>
    );
  }
}
