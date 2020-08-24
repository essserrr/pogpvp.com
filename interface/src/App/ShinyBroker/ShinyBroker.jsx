import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import Loader from "../PvpRating/Loader"

import { getCookie } from "../../js/getCookie"
import { locale } from "../../locale/locale"


let strings = new LocalizedStrings(locale);

class ShinyBroker extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            filter: {
                showReg: false,
            },
        };
    }




    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/eggs"
                    header={strings.pageheaders.eggs}
                    descr={strings.pagedescriptions.eggs}
                />
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews max1200-1 col-sm-12 col-md-11 col-lg-8 mx-0 py-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}

                        </div>
                    </div>
                </div >
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(ShinyBroker)






