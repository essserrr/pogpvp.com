import React from "react";
import propTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';

import MenuItemLink from './MenuItemLink';

const useStyles = makeStyles((theme) => ({
    iconStyle: {
        width: 36,
        height: 36,
    },
    iconStyleMargin: {
        marginRight: `${theme.spacing(1)}px`,
    },
}));

const DropdownMenu = React.memo(function DropdownMenu(props) {
    const classes = useStyles();
    const { icon, label, children } = props

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton style={{ outline: "none" }} onClick={handleMenuOpen} color="inherit">
                {React.cloneElement(icon, {
                    className: `${classes.iconStyle} ${label ? classes.iconStyleMargin : ""}`,
                })}
                {label}
            </IconButton>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}

                className={classes.menu}
            >
                {children.map((value, key) =>
                    <MenuItemLink key={key} onClick={handleMenuClose}>{value}</MenuItemLink>)}
            </Menu>
        </>
    )
});


export default DropdownMenu;

DropdownMenu.propTypes = {
    label: propTypes.oneOfType([
        propTypes.string,
        propTypes.node,
    ]),
    icon: propTypes.node,

    children: propTypes.arrayOf(propTypes.node).isRequired,
};