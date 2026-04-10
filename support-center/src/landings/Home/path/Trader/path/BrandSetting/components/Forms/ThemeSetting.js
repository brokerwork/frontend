import { Field } from 'redux-form';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import cs from './Form.less';

const renderTheme = ({ themeList, input, onChangeTheme }) => {
  const onChange = themeId => {
    onChangeTheme(themeId)
    input.onChange(themeId);
  };

  return (
    <div>
      {themeList.map((item, idx) => {
        return (
          <div
            key={idx}
            className={`${cs['theme']} ${input.value === item.themeId ? cs['selected'] : ''}`}
            onClick={onChange.bind(this, item.themeId)}
          >
            <div className={cs['image']}>
              <img src={item.thumbnail} alt={item.themeName} />
            </div>
            <div className={cs['name']}>
              <span>{item.themeName}</span>
              <a href={item.preview} target="_blank">
                {i18n['brand.setting.theme.template.preview']}
              </a>
            </div>
            <i className={cs['selected-icon']} />
          </div>
        );
      })}
    </div>
  );
};

class ThemeSetting extends PureComponent {
  render() {
		const { themeList, onChangeTheme } = this.props;
    return (
     	<div className={cs["form-section"]}>
			 	<div className={cs["form-section-title"]}>
				 	{i18n['twapp.brand_setting.theme_setting']}
				</div>
				<div className={cs["form-section-body"]}>
					<Form.Item>
						<Form.Label>{i18n['brand.setting.theme.template']}：</Form.Label>
						<Form.Control className={cs['form-theme-control']}>
							<Field name="themeId" themeList={themeList} onChangeTheme={onChangeTheme} component={renderTheme}  />
						</Form.Control>
					</Form.Item>
				</div>
		 	</div>
    );
  }
}

export default ThemeSetting;
