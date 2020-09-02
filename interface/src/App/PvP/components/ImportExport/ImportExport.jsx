import React from "react"
import ReactTooltip from "react-tooltip"
import LocalizedStrings from "react-localization"

import FileImport from "./FileImport/FileImport"
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

        this.onSubmitFile = this.onSubmitFile.bind(this);
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
        this.props.onChange({ value: this.state.value, attr: this.props.attr, type: "string" })
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

    onSubmitFile(fileString) {
        console.log(this.CSVToArray(fileString)[0])
        this.props.onChange({ value: this.CSVToArray(fileString)[0], attr: this.props.attr, type: "scv" })
    }

    CSVToArray(strData, strDelimiter = ",") {
        // Create a regular expression to parse the CSV values.
        let objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"),
            "gi"
        );
        // Create an array to hold our data. Give the array a default empty first row.
        let arrData = [[]]
        // Create an array to hold our individual pattern matching groups.
        let arrMatches = null
        // Keep looping over the regular expression matches until we can no longer find a match.
        // eslint-disable-next-line
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            let strMatchedDelimiter = arrMatches[1]
            // Check to see if the given delimiter has a length (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                // Since we have reached a new row of data, add an empty row to our data array.
                arrData.push([])
            }
            let strMatchedValue
            // Now that we have our delimiter out of the way, let's check to see which kind of value we captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"")
            } else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3]
            }
            // Now that we have our value string, let's add it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue)
        }
        // Return the parsed data.
        return (arrData)
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
                    {this.props.type === "userPokemon" && <>
                        {strings.tips.importtips.matrix.form}<br />
                        {strings.tips.importtips.matrix.p1}<br />
                        {strings.tips.importtips.matrix.q1}<br />
                        {strings.tips.importtips.matrix.ch1}<br />
                        {strings.stats.lvl + ","}
                        {strings.effStats.atk + ","}
                        {strings.effStats.def + ","}
                        {strings.effStats.sta + ","}<br />

                        {strings.tips.importtips.matrix.ent}<br />
                        {strings.tips.importtips.matrix.p2}<br />
                        {strings.tips.importtips.matrix.q1}<br />
                        {strings.tips.importtips.matrix.ch1}<br />
                        {strings.stats.lvl + ","}
                        {strings.effStats.atk + ","}
                        {strings.effStats.def + ","}
                        {strings.effStats.sta + ","}
                    </>}
                </ReactTooltip>

                {this.props.type === "userPokemon" &&
                    <FileImport
                        attr="csvFile"
                        acceptFile=".csv"

                        label={strings.import.fromfile}
                        tips={strings.tips.importtips.matrix.impCalcy}

                        returnFile={this.onSubmitFile}
                    />}

                <div className="row mx-0 justify-content-between mt-3">
                    <div className="col px-0 mr-1">
                        {strings.tips.impExp}
                    </div>
                    <i data-tip data-for={"imp-exp" + this.props.attr} className="align-self-center fas fa-info-circle fa-lg ml-4"></i>
                </div>


                <div className="row mx-0 justify-content-center mt-2 mb-3">
                    <SubmitButton
                        label={strings.buttons.copy}
                        onSubmit={this.onCopy}
                        class="maximizerButton btn btn-primary btn-sm p-0 m-0"
                    />
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