import CKEditorWrapper from 'react-ckeditor-wrapper';
import language from 'utils/language';

export default class CKEditor extends PureComponent {
  listened = false;
  editor = null;
  componentDidMount() {
    const { getInstance } = this.props;
    getInstance && getInstance(this.editor);
  }

  componentDidUpdate() {
    if (this.props.value && !this.listened) {
      setTimeout(() => {
        this.editor.instance.document.findOne('body') &&
          this.editor.instance.document.findOne('body').on('focus', evt => {
            this.props.onFocus(evt.data.$);
          });
        this.editor.instance.document.findOne('body') &&
          this.editor.instance.document.findOne('body').on('blur', evt => {
            this.props.onBlur(evt.data.$);
          });
        this.listened = true;
      }, 500);
    }
  }

  render() {
    return (
      <CKEditorWrapper
        {...this.props}
        ref={input => {
          this.editor = input;
        }}
        config={{
          allowedContent: true,
          height: '300px',
          language: language.getLang()
        }}
      />
    );
  }
}
