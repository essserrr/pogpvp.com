import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { withStyles } from "@material-ui/core/styles";

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import TableIcon from "App/PvP/components/TableBodyRender/TableIcon/TableIcon";
import AdvisorPanelBody from "./AdvisorPanelBody/AdvisorPanelBody";

const styles = theme => ({
    border: {
        borderTop: "1px solid rgba(0, 0, 0, 0.295)",
    },
    disableSpacing: {
        padding: "0px !important",
        margin: "0px !important",
    }
});

class AdvisorPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showCollapse: false,
            colElement: null,
        };
        this.onClick = this.onClick.bind(this);
    }


    onClick(event) {
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? <AdvisorPanelBody {...this.props} /> : null,
        })

    }

    render() {
        const listEntry = this.props.list[this.props.i];
        const { classes } = this.props;

        return (
            <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
                <Grid container justify="space-between" alignItems="center" spacing={2}>

                    <Box clone textAlign="center" mr={3}>
                        <Grid item xs container justify="space-between" alignItems="center" wrap="nowrap" spacing={2}>

                            <Grid item xs="auto">
                                <Box clone fontWeight="bold">
                                    <Typography variant="body2">
                                        {`#${this.props.i + 1}`}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs="auto">
                                <TableIcon pok={this.props.first}
                                    pokemonTable={this.props.pokemonTable} moveTable={this.props.moveTable} />
                            </Grid>

                            <Grid item xs="auto">
                                <TableIcon pok={this.props.second}
                                    pokemonTable={this.props.pokemonTable} moveTable={this.props.moveTable} />
                            </Grid>

                            <Grid item xs="auto">
                                <TableIcon pok={this.props.third}
                                    pokemonTable={this.props.pokemonTable} moveTable={this.props.moveTable} />
                            </Grid>

                        </Grid>
                    </Box>

                    <Grid item xs="auto">
                        <Box clone textAlign="center" mr={0.5}>
                            <i className="fas fa-skull-crossbones"></i>
                        </Box>
                        {listEntry.zeros.length}
                    </Grid>

                    <Grid item xs="auto">
                        <Box clone textAlign="center" mr={0.5}>
                            <i className="fas fa-trophy"></i>
                        </Box>
                        {(listEntry.rate / 3).toFixed(1)}
                    </Grid>

                    <Grid item xs="auto">
                        <IconButton onClick={this.onClick} style={{ outline: "none", width: '28px', height: '28px' }}>
                            {this.state.showCollapse ?
                                <KeyboardArrowUpIcon style={{ fontSize: '28px' }} />
                                :
                                <KeyboardArrowDownIcon style={{ fontSize: '28px' }} />}
                        </IconButton>
                    </Grid>

                    <Grid item xs={12} className={this.state.showCollapse ? classes.border : classes.disableSpacing}>
                        <Collapse in={this.state.showCollapse} unmountOnExit>
                            {this.state.colElement}
                        </Collapse>
                    </Grid>

                </Grid>
            </GreyPaper>

        );
    }
};

export default withStyles(styles, { withTheme: true })(AdvisorPanel);

AdvisorPanel.propTypes = {
    first: PropTypes.object,
    second: PropTypes.object,
    third: PropTypes.object,
    i: PropTypes.number,

    list: PropTypes.arrayOf(PropTypes.object),
    rawResult: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    leftPanel: PropTypes.object,
    rightPanel: PropTypes.object,
};