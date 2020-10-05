import React from "react"
import LocalizedStrings from "react-localization"

import Loader from "../../../../../../../../Registration/RegForm/AuthButton/Loader/Loader"
import SubmitButton from "../../../../../../../../PvP/components/SubmitButton/SubmitButton"
import Errors from "../../../../../../../../PvP/components/Errors/Errors"
import { pveLocale } from "../../../../../../../../../locale/pveLocale"

let pveStrings = new LocalizedStrings(pveLocale)

class PveResultCollapseList extends React.PureComponent {
    render() {
        return (

            <div className="row m-0  mt-1">

                {this.props.isError && <div className="col-12 d-flex justify-content-center p-0 mb-2 mt-3" >
                    <Errors class="alert alert-danger p-2" value={this.props.error} /></div>}

                {!this.props.needsAverage && <div className="col-12 d-flex justify-content-center p-0 mb-1 mt-2" >
                    <SubmitButton
                        label={this.props.loading ? <Loader duration="1.5s" /> : pveStrings.pres}
                        action="Precision"
                        onSubmit={this.props.rerunWithPrecision}
                        class="submit-button--lg fix btn btn-primary btn-sm mt-0  mx-0"
                    />
                </div>}
                {!this.props.customResult && <div className="col-12 d-flex justify-content-center p-0 mb-1 mt-2" >
                    <SubmitButton
                        label={pveStrings.break}
                        action="Breakpoints"
                        onSubmit={this.props.defineBreakpoints}
                        class="submit-button--lg fix btn btn-primary btn-sm mt-0  mx-0"
                    />
                </div>}
                {this.props.children}
            </div>
        );
    }
};

export default PveResultCollapseList;


