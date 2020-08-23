import React from "react"
import LocalizedStrings from "react-localization"

import LabelAndInput from "../../CustomMoves/LabelAndInput/LabelAndInput"
import CountryAndRegion from "./CountryAndRegion/CountryAndRegion"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale)

class ShBrokerForm extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0 justify-content-center">
                <div className="col-12 col-md-6 col-lg-6 px-1 py-1">
                    <CountryAndRegion
                        type="Country"
                        labelWidth="151px"
                        label={strings.shbroker.country}
                        Country={this.props.value.Country}
                        onChange={this.props.selectCountry}
                        notOk={this.props.notOk.Country}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-6 px-1 py-1">
                    <CountryAndRegion
                        type="Region"
                        labelWidth="151px"
                        label={strings.shbroker.region}
                        Country={this.props.value.Country}
                        Region={this.props.value.Region}
                        onChange={this.props.selectRegion}
                        notOk={this.props.notOk.Country}
                    />
                </div>
                <div className="col-12 col-md-10 col-lg-6 px-1 py-1">
                    <LabelAndInput
                        labelWidth="151px"
                        label={strings.shbroker.city}
                        place={strings.shbroker.cityPlace}

                        name="City"
                        type={"text"}

                        value={this.props.value.City}
                        notOk={this.props.notOk.City}

                        onChange={this.props.onChange}
                    />
                </div>

                <div className="col-12 col-md-10 col-lg-6 px-1 py-1">
                    <LabelAndInput
                        label={strings.shbroker.cont}
                        place={strings.shbroker.contPlace}

                        name="Contacts"
                        type={"text"}

                        value={this.props.value.Contacts}
                        notOk={this.props.notOk.Contacts}

                        onChange={this.props.onChange}
                    />
                </div>
            </div>
        );
    }
}

export default ShBrokerForm
