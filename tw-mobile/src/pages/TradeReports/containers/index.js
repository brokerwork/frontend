import { connect } from 'react-redux'

import Tradereports from '../components/index'
import * as actions from '../actions'
import * as commonActions from 'common/commonActions'

export default connect(
    (state) => { 
        return {
            selectedAccount: state.common.selectedAccount,
            brand: state.common.brand,
            tradereportsPage: state.tradereportsPage,
            structuralList: state.common.structuralList
        }
    },
    {...actions, ...commonActions}
)(Tradereports)