import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as Raid } from "icons/raid.svg";

const useStyles = makeStyles((theme) => ({
    icon: {
        width: "24px",
        height: "24px",
        marginLeft: `${theme.spacing(1)}px`,
    },
}));

const RaidIcon = React.memo(function RaidIcon(props) {
    const classes = useStyles();

    function multiply(n, key) {
        if (Number(n) < 0) {
            return []
        }
        let result = []
        for (let i = 0; i < Number(n); i++) {
            result.push(<Raid key={key + i} className={classes.icon} />)
        }
        return result
    }

    return (
        <>
            {props.title}
            {multiply(props.n, props.title)}
        </>
    )
});

export default RaidIcon;

RaidIcon.propTypes = {
    n: PropTypes.number.isRequired,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
};