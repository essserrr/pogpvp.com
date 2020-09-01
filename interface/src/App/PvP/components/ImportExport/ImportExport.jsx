import React from "react"
import ReactTooltip from "react-tooltip"

import LocalizedStrings from "react-localization"
import SubmitButton from "../SubmitButton/SubmitButton"

import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(locale)

class ImportExport extends React.PureComponent {
    constructor(props) {
        super(props);
        this.textArea = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            value: this.formatActiveList(this.props.initialValue),
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCopy = this.onCopy.bind(this);
    }

    formatActiveList(list) {
        switch (this.props.type) {
            case "matrix":
                return list.reduce(((result, elem, i, arr) => {
                    result += (`${elem.name}${elem.IsShadow === "false" ? "" : "!shadow"},${elem.QuickMove},${elem.ChargeMove1},${elem.ChargeMove2}`)
                    if (i + 1 < arr.length) {
                        result += "\n"
                    }
                    return result
                }), "")
            case "shiny":
                return list.reduce(((result, elem, i, arr) => {
                    result += (this.props.pokemonTable[elem.Name].Number +
                        (this.props.pokemonTable[elem.Name].Forme ? "-" + this.props.pokemonTable[elem.Name].Forme : ""))
                    if (i + 1 < arr.length) { result += "," }
                    return result
                }), "")
            default:

        }

    }

    onSubmit(event) {
        this.props.onChange({ value: this.state.value, attr: this.props.attr, })
    }

    onChange(event) {
        this.setState({
            value: event.target.value,
        })
    }

    onCopy() {
        this.textArea.current.select();
        document.execCommand('copy');
    }

    render() {
        return (
            <>
                <ReactTooltip
                    className={"infoTip"}
                    id={"imp-exp" + this.props.attr} effect="solid"
                    place={"bottom"}
                    multiline={true}
                >
                    {this.props.type === "matrix" ? <>
                        {strings.tips.importtips.matrix.form}<br />
                        {strings.tips.importtips.matrix.p1}<br />
                        {strings.tips.importtips.matrix.q1}<br />
                        {strings.tips.importtips.matrix.ch1}<br />
                        {strings.tips.importtips.matrix.ch2}<br />
                        {strings.tips.importtips.matrix.ent}<br />
                        {strings.tips.importtips.matrix.p2}<br />
                        {strings.tips.importtips.matrix.q1}<br />
                        {strings.tips.importtips.matrix.ch1}<br />
                        {strings.tips.importtips.matrix.ch2}<br /><br />

                        {strings.tips.importtips.matrix.imp}
                    </> :
                        <>
                            {strings.tips.importtips.shiny.form}<br />
                            {strings.tips.importtips.shiny.pok1}<br />
                            {strings.tips.importtips.shiny.pok2}<br />
                            {strings.tips.importtips.shiny.ex}<br />
                            {strings.tips.importtips.shiny.expok}<br /><br />

                            {strings.tips.importtips.shiny.forms}<br /><br />

                            {strings.tips.importtips.shiny.shcheck}
                        </>}
                </ReactTooltip>

                <div className="row mx-0 justify-content-between">{strings.tips.impExp}</div>


                <div className="row mx-0 justify-content-between mt-2 mb-3">
                    <SubmitButton
                        label={strings.buttons.copy}
                        onSubmit={this.onCopy}
                        class="maximizerButton btn btn-primary btn-sm p-0 m-0"
                    />
                    <i data-tip data-for={"imp-exp" + this.props.attr} className="align-self-center fas fa-info-circle fa-lg ml-4"></i>
                </div>

                <textarea onChange={this.onChange} value={this.state.value} ref={this.textArea}
                    className="form-control mt-2" rows="7">
                </textarea>

                <div className="row mx-0 justify-content-center mt-3 mb-1">
                    <SubmitButton
                        action={this.props.action}
                        label={strings.buttons.imp}
                        attr={this.props.attr}
                        onSubmit={this.onSubmit}
                        class="matrixButton btn btn-primary btn-sm p-0 m-0"
                    />
                </div>
            </>
        )
    }

}

export default ImportExport