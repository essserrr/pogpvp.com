import React from "react";
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import MaterialSwitch from '@material-ui/core/Switch';

const Switch = React.memo(function Switch(props) {
    const { checked, onChange, color, label, type, category, name, attr, ...other } = props;

    return (
        <FormControlLabel
            control={
                <MaterialSwitch
                    checked={checked}
                    attr={`${attr}Custom`}
                    name={"SupportSlotEnabled"}
                    color={color ? color : "primary"}

                    onChange={(event, ...otherOptions) => onChange(event, { type: type, name: name, category: category, attr: attr, }, ...otherOptions)}

                    {...other}
                />}
            label={label}
        />
    )
});

export default Switch;

Switch.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    type: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    attr: PropTypes.string,

    color: PropTypes.string,

    checked: PropTypes.bool,

    onChange: PropTypes.func,
};