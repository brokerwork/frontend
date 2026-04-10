import VerifyIdButton from '../../containers/Root';
import { TYPE_KEY_MAP } from '../../constants';
import { getDataOfOwner, getIdByIdType, getResultOfOwner } from '../../utils';

export default class VerifyForAccount extends PureComponent {
  render() {
    const {
      onSubmit,
      data = {},
      fields = {},
      buttonClassName,
      keys,
      fieldKeys
    } = this.props;
    return (
      <VerifyIdButton
        fields={fields}
        buttonClassName={buttonClassName}
        verifyData={getDataOfOwner(data, fields, keys, fieldKeys)}
        verifyResult={getResultOfOwner(data)}
        onSubmit={onSubmit}
      />
    );
  }
}
