import React from "react";
import PropTypes from 'prop-types';

import MaterialButton from '@material-ui/core/Button';
import Loader from "./Loader/Loader";

const Button = React.memo(function Button(props) {
    const { endIcon, loading, title, onClick, ...other } = props;

    return (
        <MaterialButton onClick={onClick}
            endIcon={loading ? <Loader duration="1.5s" /> : endIcon}
            type="submit" variant="contained" color="primary"
            {...other}
        >
            {title}
        </MaterialButton>
    )
})

export default Button;

Button.propTypes = {
    endIcon: PropTypes.node,
    loading: PropTypes.bool,

    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    onClick: PropTypes.func,
};