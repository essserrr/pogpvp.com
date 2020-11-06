import React from "react";
import propTypes from 'prop-types';

import { withStyles } from "@material-ui/core/styles";
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    menuItem: {
        padding: 0,
        "& > *": {
            width: "100%",
            hegiht: "100%",

            padding: `${theme.spacing(0.75)}px ${theme.spacing(2)}px`,

            color: theme.palette.text.primary,
            "&:hover": {
                color: theme.palette.text.primary,
            }
        },
    },
});


class MenuItemLink extends React.PureComponent {
    render() {
        const { classes, children, theme, ...other } = this.props
        return (
            <MenuItem className={classes.menuItem} {...other}>
                {children}
            </MenuItem>
        );
    }
};


export default withStyles(styles, { withTheme: true })(MenuItemLink);

MenuItemLink.propTypes = {
    children: propTypes.oneOfType([
        propTypes.arrayOf(propTypes.node),
        propTypes.node
    ]).isRequired,
};