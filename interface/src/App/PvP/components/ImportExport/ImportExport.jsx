import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { withStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import Button from "App/Components/Button/Button";
import ImportTips from "./ImportTips/ImportTips";
import FileImport from "./FileImport/FileImport"

import { locale } from "../../../../locale/locale"
import { impExp } from "locale/ImportExport/ImportExport";
import { getCookie } from "js/getCookie"

let strings = new LocalizedStrings(locale)
let impExpStrings = new LocalizedStrings(impExp)


const styles = theme => ({
    container: {
        marginTop: `${theme.spacing(1)}px`,
    },
    textArea: {
        border: `1px solid ${theme.palette.text.primary}`,
        display: "block",
        width: "100%",
        padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
        fontSize: "1rem",
        fontWeight: "400",
        lineHeight: "1.5",
        borderRadius: `${theme.spacing(0.5)}px`,
        transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    },
    defaultIcon: {
        "&:hover": {
            fill: theme.palette.secondary.light,
        }
    }
});


class ImportExport extends React.PureComponent {
    constructor(props) {
        super(props);
        this.textArea = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        impExpStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            value: this.formatActiveList(props.initialValue),

            loadedFile: null,
            ok: false,
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
                    result += (`${elem.Name}${elem.IsShadow === "false" ? "" : "!shadow"},${elem.QuickMove},${elem.ChargeMove},${elem.ChargeMove2},${elem.Lvl},${elem.Atk},${elem.Def},${elem.Sta}`)
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

    async onCopy() {
        this.textArea.current.select();
        document.execCommand('copy');
        this.setState({ ok: true, })
        await new Promise(res => setTimeout(res, 4000));
        this.setState({ ok: false })
    }

    onclick() {
        this.value = null;
    };

    onSubmitFile(fileString) {
        this.props.onChange({ value: this.CSVToArray(fileString), attr: this.props.attr, type: "scv" })
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
        const { classes } = this.props;

        return (
            <Grid container justify="center" spacing={2} className={classes.container}>
                {this.props.type === "userPokemon" &&
                    <Grid item xs={12}>
                        <FileImport
                            attr="csvFile"
                            acceptFile=".csv"

                            label={impExpStrings.import.fromfile}
                            tips={<>
                                {impExpStrings.importtips.matrix.impCalcy}
                                <br /><br />
                                {impExpStrings.importtips.matrix.impformat}
                            </>}

                            returnFile={this.onSubmitFile}
                        />
                    </Grid>}

                <Grid item xs={12}>
                    <Grid container justify="space-between" spacing={1}>
                        <Grid item xs>
                            <Typography>
                                {impExpStrings.impExp}
                            </Typography>
                        </Grid>
                        <Tooltip title={<Typography color="inherit">{<ImportTips type={this.props.type} />}</Typography>}>
                            <HelpOutlineIcon className={classes.defaultIcon} />
                        </Tooltip>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <textarea onChange={this.onChange} value={this.state.value} ref={this.textArea}
                        className={classes.textArea} rows="7">
                    </textarea>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Button
                            onClick={this.onCopy}
                            title={impExpStrings.copy}
                            endIcon={<FileCopyIcon />}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Button
                            onClick={this.onSubmit}
                            title={impExpStrings.imp}
                            endIcon={<ImportExportIcon />}
                        />
                    </Grid>
                </Grid>



                <Snackbar open={this.state.ok} onClose={() => { this.setState({ ok: false }) }}>
                    <Alert variant="filled" severity="success">{impExpStrings.success}</Alert >
                </Snackbar>
            </Grid>
        )
    }

}

export default withStyles(styles, { withTheme: true })(ImportExport);

ImportExport.propTypes = {
    action: PropTypes.string,
    attr: PropTypes.string,
    type: PropTypes.string.isRequired,

    onChange: PropTypes.func,
    pokemonTable: PropTypes.object,
    initialValue: PropTypes.array,
};