import React from "react";
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';

import Iconer from "App/Components/Iconer/Iconer";
import WithIcon from 'App/Components/WithIcon/WithIcon';
import InputWithError from 'App/Components/InputWithError/InputWithError';


const MoveSelect = React.memo(function MoveSelect(props) {
    const { label, attr, name, value, onChange, tip, moveType, children, ...other } = props;

    return (
        <WithIcon tip={tip} icon={moveType !== "" ? <Iconer fileName={String(moveType)} folderName="/type/" size="18" /> : ""}>
            <InputWithError
                label={label}
                select

                name={name}
                value={value}
                attr={attr}

                onChange={onChange}
                {...other}
            >
                {children ? children.map((move, key) => <MenuItem key={key} value={move.value} >{move.title}</MenuItem>) : []}
            </InputWithError>
        </WithIcon>
    )
});

export default MoveSelect;

MoveSelect.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.arrayOf(PropTypes.object),
    ]),
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    tip: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    moveType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    attr: PropTypes.string,
    name: PropTypes.string,
    errorText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    helperText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    onChange: PropTypes.func,
    className: PropTypes.string,
};