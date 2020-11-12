import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { withStyles } from "@material-ui/core/styles";

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Iconer from "App/Components/Iconer/Iconer";

const styles = theme => ({
    link: {
        textDecoration: "none",
        color: theme.palette.text.primary,
        "&:hover": {
            color: theme.palette.text.link,
            textDecoration: "underline",
            cursor: "pointer",
        },
    },

    icon: {
        width: "300px !important",
        height: "271px !important",
    },
});

class OopsError extends React.Component {
    constructor() {
        super();
        this.notFound = React.createRef();
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
    };

    focusDiv() {
        this.notFound.current.focus();
    };


    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="center">
                <GreyPaper elevation={4} enablePadding className="ooops">
                    <Grid container justify="center" spacing={2}>

                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" justifyContent="center">

                                <Iconer fileName="ooops" folderName="/" className={classes.icon} />

                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography align="center" variant="h5">
                                {this.props.description}
                            </Typography>
                        </Grid>


                        <div tabIndex="0" ref={this.notFound}></div>

                        <Grid item xs={12}>

                            <Link title={this.props.linkTitle} to={this.props.link} className={classes.link}>
                                <Typography variant="h6">

                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <DoubleArrowIcon style={{ transform: "rotate(180deg)" }} />
                                        {this.props.linkTitle}
                                    </Box>

                                </Typography>
                            </Link>

                        </Grid>

                    </Grid>
                </GreyPaper>
            </Grid >
        );
    }
}

export default withStyles(styles, { withTheme: true })(OopsError);

OopsError.propTypes = {
    description: PropTypes.string,
    link: PropTypes.string,
    linkTitle: PropTypes.string,
};