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

            loadedFile: null,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCopy = this.onCopy.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
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
            case "userPokemon":
                return list.reduce(((result, elem, i, arr) => {
                    result += (`${elem.Name}${elem.IsShadow === "false" ? "" : "!shadow"},${elem.QuickMove},${elem.ChargeMove},${elem.Lvl},${elem.Atk},${elem.Def},${elem.Sta}`)
                    if (i + 1 < arr.length) {
                        result += "\n"
                    }
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

    onclick() {
        this.value = null;
    };

    handleSubmit(event) {
        event.preventDefault()
        let file = this.fileInput.current.files[0]
        if (!file) {return }
        
        var reader = new FileReader()
        reader.onload = (readerEvent) => {
            this.setState({
                loadedFile: reader.result,
            })
        }
        reader.readAsText(file)

    }

    render() {
        console.log(this.state.loadedFile)
        return (
            <>
                <ReactTooltip
                    className={"infoTip"}
                    id={"imp-exp" + this.props.attr} effect="solid"
                    place={"bottom"}
                    multiline={true}
                >
                    {this.props.type === "matrix" && <>
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
                    </>}
                    {this.props.type === "shiny" && <>
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

                {this.props.type === "userPokemon" && <form onSubmit={this.handleSubmit}>
                    <label>
                        Upload file:
          
                    </label>
                    <input type="file" accept=".csv" ref={this.fileInput} />
                    <br />
                    <button type="submit">Submit</button>
                </form>}

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