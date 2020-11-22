import React, { useState } from 'react';

import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        position: "fixed",
        right: "5%",
        bottom: "5%",
    },
}));

const ScrollTop = function ScrollTop() {
    const classes = useStyles();

    const [showScroll, setShowScroll] = useState(false)

    const checkScrollTop = () => {
        const threshold = 2;
        const maxHeight = window.innerHeight * threshold;

        if (!showScroll && window.pageYOffset > maxHeight) {
            setShowScroll(true)
        } else if (showScroll && window.pageYOffset <= maxHeight) {
            setShowScroll(false)
        }
    };
    window.addEventListener('scroll', checkScrollTop)

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        showScroll &&
        <Fab className={classes.button} color="secondary" onClick={scrollTop}>
            <NavigationIcon />
        </Fab>
    );
}

export default ScrollTop;