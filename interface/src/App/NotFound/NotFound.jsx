import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";


import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"


let strings = new LocalizedStrings(locale);


class NotFound extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
        };
        this.focusDiv = this.focusDiv.bind(this);

    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };

    focusDiv() {
        this.refs.notfound.focus();
    };


    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/"
                    header={strings.notfound}
                    descr={strings.notfound}
                />
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews col-sm-12 col-md-7 col-lg-5 p-0 pb-4">
                            <div className="row  justify-content-center m-0"  >
                                <div className="text404 align-self-center">
                                    4
                                </div>
                                <div className="window404 align-self-center">
                                    <PokemonIconer
                                        src={"404"}
                                        folder="/"
                                        class={"icon404"} />
                                </div>
                                <div className="text404 align-self-center">
                                    4
                                </div>
                                <h5 className="col-12 font-weight-bold align-self-center text-center ">
                                    {strings.notfound}
                                </h5>
                                <div tabIndex="0" ref="notfound"></div>
                                <a title={strings.buttons.home} className="row ml-2 mr-1 linkText font-weight-bold text-center" href="/">
                                    <i className="fas fa-angle-double-left align-self-center  mr-1"></i>
                                    {strings.return}
                                </a>

                            </div>
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default NotFound

