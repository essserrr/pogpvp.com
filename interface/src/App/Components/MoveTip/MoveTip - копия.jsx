import React from "react";
import PropTypes from 'prop-types';

const Iconer = React.memo(function Iconer(props) {
    const { fileName, folderName, className, size, ...other } = props;


 

    return (
        {<>
            {strings.tips.charge}<br />
            {(this.props.value.ChargeMove && this.props.value.ChargeMove !== "Select...") &&
                this.props.moveTable[this.props.value.ChargeMove] !== undefined &&
                <>
                    {strings.move.damage + (this.props.moveTable[this.props.value.ChargeMove].Damage)}<br />
                    {strings.move.energy + (-this.props.moveTable[this.props.value.ChargeMove].Energy)}<br />
                    {"Cooldown: " + (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000)}<br />
                    {"DPS: " + (this.props.moveTable[this.props.value.ChargeMove].Damage / (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000)).toFixed(2)}<br />
                    {"DPS*DPE: " + (this.props.moveTable[this.props.value.ChargeMove].Damage /
                        (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000) *
                        this.props.moveTable[this.props.value.ChargeMove].Damage /
                        -this.props.moveTable[this.props.value.ChargeMove].Energy).toFixed(2)}<br />
                </>}
                </>}
    )
});

export default Iconer;

Iconer.propTypes = {
    fileName: PropTypes.string,
    folderName: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ])
};