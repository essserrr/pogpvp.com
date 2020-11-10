import React from "react"
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles((theme) => ({
    tabs: {
        display: "flex",
        flexWrap: "wrap",
    },
    tab: {
        flexBasis: "0",
        flexGrow: "1",
        maxWidth: "100%",

        position: "relative",
        lineHeight: "inherit",

        backgroundColor: "transparent",

        color: theme.palette.text.primary,
        fontWeight: 400,

        "&:focus": {
            outline: "none",
        },
    }
}));

const DoubleSlider = React.memo(function DoubleSlider(props) {
    const { attrs, titles, active, onClick } = props;
    const classes = useStyles();

    const activeTab = active.indexOf(true);

    return (
        <Tabs className={classes.tabs}
            value={activeTab === -1 ? false : activeTab}
            onChange={(event, value) => { onClick(event, { attr: attrs[value] }) }}
        >
            <Tab className={classes.tab} label={titles[0]} id={0} aria-controls="0" />

            <Tab className={classes.tab} label={titles[1]} id={1} aria-controls="1" />
        </Tabs>
    )
});

export default DoubleSlider;

DoubleSlider.propTypes = {
    active: PropTypes.arrayOf(PropTypes.bool),
    titles: PropTypes.arrayOf(PropTypes.string),
    attrs: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func,
};