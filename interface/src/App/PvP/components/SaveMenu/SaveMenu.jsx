import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';

import Button from "App/Components/Button/Button";
import Input from "App/Components/Input/Input";

import { saveMenu } from "locale/Pvp/SaveMenu/SaveMenu";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(saveMenu);

class SaveMenu extends React.PureComponent {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        this.state = {
            value: "",
            isError: false,
            error: "",
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit() {
        this.setState({
            error: this.state.value === "" ? strings.errors.savegroup : "",
        })
        if (this.state.value === "") { return }

        this.props.onChange({ value: this.state.value, attr: this.props.attr, })
    }

    onChange(event) {
        if (event.target.value.length > 15) {
            return
        }
        this.setState({
            value: event.target.value,
            error: event.target.value === "" ? strings.errors.savegroup : "",
        })
    }

    render() {
        return (
            <Grid container justify="center" spacing={2}>
                {this.state.isError && <Alert variant="filled" severity="error">{this.state.error}</Alert >}

                <Tooltip title={<Typography>{strings.tips.savegroup}</Typography>}>
                    <Grid item xs={12}>
                        <Input label={strings.title.savegroupplaceholder} value={this.state.value}
                            errorText={this.state.error} onChange={this.onChange} />
                    </Grid>
                </Tooltip>


                <Grid item xs="auto">
                    <Button title={strings.buttons.savegroup} onClick={this.onSubmit} endIcon={<SaveIcon />} />
                </Grid>

            </Grid>
        )
    }

}

export default SaveMenu;

SaveMenu.propTypes = {
    attr: PropTypes.string,
    onChange: PropTypes.func,
};