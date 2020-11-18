import React from "react";
import PropTypes from 'prop-types';

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    defaultIcon: {
        "&:hover": {
            fill: theme.palette.secondary.light,
        }
    }
});


class DefaultIconStyle extends React.Component {
    render() {
        const { classes, children, theme, className, ...other } = this.props;
        return (
            React.cloneElement(children, {
                className: classes.defaultIcon,
                ...other
            })
        );
    }
};

export default withStyles(styles, { withTheme: true })(DefaultIconStyle);

DefaultIconStyle.propTypes = {
    children: PropTypes.node.isRequired,
};