import { connect } from 'react-redux'

import Leverage from '../components/index'
import * as actions from '../actions'
import * as commonActions from 'common/commonActions'

export default connect(
    (state) => { 
        return {
            selectedAccount: state.common.selectedAccount,
            brand: state.common.brand,
            leveragePage: state.leveragePage,
            structuralList: state.common.structuralList
        }
    },
    {...actions, ...commonActions}
)(Leverage)