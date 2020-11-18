import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import TimelineGenerator from "./TimelineGenerator/TimelineGenerator";

import { reconstr } from "locale/Pvp/Reconstruction/Reconstruction";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(reconstr);

const styles = theme => ({
    timeline: {
        borderRadius: "13px",
        border: `solid ${theme.palette.text.primary}`,
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(0.5)}px ${theme.spacing(2)}px`,

        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",

        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
        backgroundColor: theme.palette.background.main,
        "&.on": {
            borderColor: theme.palette.secondary.main,
            boxShadow: `0px 0px 12px ${theme.palette.secondary.main}, 0px 0px 2px ${theme.palette.secondary.main},
        0px 0px 6px ${theme.palette.secondary.main}, 0px 0px 12px ${theme.palette.secondary.main}`,
        }
    },
    editButton: {
        width: 20,
        height: 20,
        position: "absolute",
        top: 1,
        right: 6,
        outline: "none !important",
    },
    editIcon: {
        fontSize: "20px",
        cursor: "pointer",

        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",
        "&.on": {
            fill: theme.palette.secondary.main,
        }
    }
});

class PvpReconstruction extends React.PureComponent {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        this.reconstruction = React.createRef();
        this.state = { constructor: false, };
        this.onEnableConstructor = this.onEnableConstructor.bind(this);
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };
    focusDiv() {
        this.reconstruction.current.focus();
    };

    onEnableConstructor(event) {
        this.setState({ constructor: !this.state.constructor, })
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container style={{ position: "relative" }}>
                <Tooltip arrow placement="top" title={<Typography>{strings.constructorTip}</Typography>}>
                    <IconButton onClick={this.onEnableConstructor} className={classes.editButton}>
                        <EditIcon className={`${classes.editIcon} ${this.state.constructor ? "on" : ""}`} />
                    </IconButton>
                </Tooltip>

                <Grid item xs={12} className={`${classes.timeline} ${this.state.constructor ? "on" : ""}`} tabIndex="0" ref={this.reconstruction}>
                    <Table cellSpacing="0" cellPadding="0" border="0" style={{ width: "100%", justifyContent: "center", }} >
                        <TableBody>
                            <TimelineGenerator
                                log={this.props.value.Log}
                                moveTable={this.props.moveTable}
                                onMouseEnter={this.props.onMouseEnter}
                                constructorOn={this.state.constructor ? this.props.constructorOn : null}
                            />
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles, { withTheme: true })(PvpReconstruction);

PvpReconstruction.propTypes = {
    onMouseEnter: PropTypes.func,
    constructorOn: PropTypes.func,
    value: PropTypes.object,
    moveTable: PropTypes.object,
};