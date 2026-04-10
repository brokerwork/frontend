import * as React from 'react';
import {Commonlog} from "./commonlog";
import {I18nLoader} from '../../i18n/loader';


interface P {
    title: string
}
interface S {
}

class AccountLog extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
    }

    render() {
        return (
            <Commonlog  title={I18nLoader.get('setting.siderbar.log.system')} />
        );
    }
}

export {AccountLog};