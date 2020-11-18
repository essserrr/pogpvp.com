import React from "react"
import LocalizedStrings from "react-localization"

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import DefaultIconStyle from "App/Components/WithIcon/DefaultIconStyle";
import Button from "App/Components/Button/Button";

import { impExp } from "locale/ImportExport/ImportExport"
import { getCookie } from "js/getCookie"

let strings = new LocalizedStrings(impExp)


const styles = theme => ({
    defaultIcon: {
        "&:hover": {
            fill: theme.palette.secondary.light,
        }
    },

    fileInput: {
        opacity: "0%",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
});

class FileImport extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            labelTitle: strings.import.file,
            lang: getCookie("appLang") ? getCookie("appLang") : "en",
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)

        this.fileInput = React.createRef()
    }


    onSubmit(event) {
        event.preventDefault()
        let file = this.fileInput.current.files[0]

        if (!file) { return }

        if (!this.checkFileFormat(file.name)) {
            this.resetActiveFile()
            return
        }

        var reader = new FileReader()
        reader.onload = (readerEvent) => {
            this.props.returnFile(reader.result)
        }

        reader.readAsText(file)
    }

    checkFileFormat(fileName) {
        let allowedFormats = this.props.acceptFile.split(", ")
        if (allowedFormats.length === 0) { return true }
        return allowedFormats.reduce((sum, val) => sum || fileName.includes(val), false)
    }

    resetActiveFile() {
        this.fileInput.current.value = null
        this.setState({
            labelTitle: strings.import.file,
        })
    }


    onClick() {
        this.fileInput.current.value = null
        this.setState({
            labelTitle: strings.import.file,
        })
    }

    onChange() {
        if (!this.checkFileFormat(this.fileInput.current.files[0].name)) {
            this.resetActiveFile()
            return
        }

        this.setState({
            labelTitle: this.fileInput.current.files[0].name,
        })
    }



    render() {
        const { classes } = this.props;


        return (
            <Grid component="form" container spacing={2} onSubmit={this.onSubmit}>

                <Grid item xs={12}>
                    <Grid container justify="space-between" spacing={1}>
                        <Grid item xs>
                            <Typography>
                                {this.props.label}
                            </Typography>
                        </Grid>
                        <Tooltip placement="top" arrow
                            title={<Typography color="inherit">{this.props.tips}</Typography>}>
                            <DefaultIconStyle>
                                <HelpOutlineIcon className={classes.defaultIcon} />
                            </DefaultIconStyle>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        type="file"
                        label={this.state.labelTitle}

                        inputProps={{
                            className: classes.fileInput,
                            ref: this.fileInput,
                            lang: this.state.lang,
                            accept: this.props.acceptFile,
                        }}

                        InputLabelProps={{
                            shrink: false,
                        }}

                        onClick={this.onClick}
                        onChange={this.onChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Button
                            onClick={this.onSubmit}
                            title={strings.import.read}
                            endIcon={<FolderOpenIcon />}
                        />
                    </Grid>
                </Grid>
            </Grid>
        )
    }

}

export default withStyles(styles, { withTheme: true })(FileImport);
