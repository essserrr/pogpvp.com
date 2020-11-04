import React from "react";
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Loader from "./Loader/Loader";

const AuthButton = React.memo(function (props) {
    const { endIcon, loading, title, onClick, ...other } = props;

    return (
        <Button onClick={onClick}
            endIcon={loading ? <Loader duration="1.5s" /> : endIcon}
            type="submit" variant="contained" color="primary"
            {...other}
        >
            {title}
        </Button>
    )
})

export default AuthButton;

AuthButton.propTypes = {
    endIcon: PropTypes.node,
    loading: PropTypes.bool,

    title: PropTypes.string,
    onClick: PropTypes.func,
};