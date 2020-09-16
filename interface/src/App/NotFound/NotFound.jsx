import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/getCookie"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"

import "./NotFound.scss"

let strings = new LocalizedStrings(locale)


class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.notFound = React.createRef();

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
        this.notFound.current.focus();
    };


    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/"
                    header={strings.notfound}
                    descr={strings.notfound}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className="row justify-content-center px-2 pb-2">
                        <div className="not-found col-sm-12 col-md-7 col-lg-5 p-0 pb-4">
                            <div className="row justify-content-center m-0"  >
                                <div className="not-found--text align-self-center">
                                    4
                                </div>
                                <div className="not-found__window align-self-center">
                                    <PokemonIconer
                                        src={"404"}
                                        folder="/"
                                        class={"not-found__icon"} />
                                </div>
                                <div className="not-found--text align-self-center">
                                    4
                                </div>
                                <h5 className="col-12 font-weight-bold align-self-center text-center ">
                                    {strings.notfound}
                                </h5>
                                <div tabIndex="0" ref={this.notFound}></div>
                                <Link title={strings.buttons.home}
                                    className="not-found__link--text row ml-2 mr-1 font-weight-bold text-center"
                                    to={"/"}>
                                    <i className="fas fa-angle-double-left align-self-center  mr-1"></i>
                                    {strings.return}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default NotFound

