import React from "react"
import LocalizedStrings from "react-localization"

import LabelAndInput from "../../CustomMoves/LabelAndInput/LabelAndInput"
import Country from "./CountryAndRegion/Country/Country"
import Region from "./CountryAndRegion/Region/Region"

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
                    <Country
                        label={strings.shbroker.country}
                        labelWidth="151px"

                        for={""}

                        defaultOption={this.props.placeholders.cPlace}
                        notOk={this.props.notOk.Country}

                        selectValue={this.props.value.Country}
                        onChange={this.props.selectCountry}

                    />
                </div>

                <div className="col-12 col-md-6 col-lg-6 px-1 py-1">
                    <Region
                        label={strings.shbroker.region}
                        labelWidth="151px"

                        for=""

                        defaultOption={this.props.placeholders.rPlace}
                        notOk={this.props.notOk.Region}
                        country={this.props.value.Country}

                        selectValue={this.props.value.Region}
                        onChange={this.props.selectRegion}

                    />
                </div>
                <div className="col-12 col-md-10 col-lg-6 px-1 py-1">
                    <LabelAndInput
                        labelWidth="151px"
                        label={strings.shbroker.city}
                        place={this.props.placeholders.cityPlace}

                        name="City"
                        type={"text"}

                        value={this.props.value.City}
                        notOk={this.props.notOk.City}

                        onChange={this.props.onChange}
                    />
                </div>

                <div className="col-12 col-md-10 col-lg-6 px-1 py-1">
                    <LabelAndInput
                        labelWidth="151px"
                        label={strings.shbroker.cont}
                        place={this.props.placeholders.contPlace}

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
