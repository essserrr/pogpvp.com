import React from "react"
import LocalizedStrings from "react-localization"

import Alert from '@material-ui/lab/Alert';

import SubmitButton from "../../../../../../../../PvP/components/SubmitButton/SubmitButton"
import { pveLocale } from "../../../../../../../../../locale/pveLocale"

let pveStrings = new LocalizedStrings(pveLocale)

class PveResultCollapseList extends React.PureComponent {
    render() {
        return (

            <div className="row m-0  mt-1">

                {this.props.isError && <div className="col-12 d-flex justify-content-center p-0 mb-2 mt-3" >
                    <Alert variant="filled" severity="error">{this.props.error}</Alert></div>}

                {!this.props.needsAverage && <div className="col-12 d-flex justify-content-center p-0 mb-1 mt-2" >
                    <SubmitButton
                        action="Precision"
                        onSubmit={this.props.rerunWithPrecision}
                        class="submit-button--lg fix btn btn-primary btn-sm mt-0  mx-0"
                    >
                        {this.props.loading ? pveStrings.pres : pveStrings.pres}
                    </SubmitButton>
                </div>}
                {!this.props.customResult && <div className="col-12 d-flex justify-content-center p-0 mb-1 mt-2" >
                    <SubmitButton
                        action="Breakpoints"
                        onSubmit={this.props.defineBreakpoints}
                        class="submit-button--lg fix btn btn-primary btn-sm mt-0  mx-0"
                    >
                        {pveStrings.break}
                    </SubmitButton>
                </div>}
                {this.props.children}
            </div>
        );
    }
};

export default PveResultCollapseList;


