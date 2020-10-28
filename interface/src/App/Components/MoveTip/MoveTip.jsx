import React from "react";
import PropTypes from 'prop-types';

const Iconer = React.memo(function Iconer(props) {
    const { fileName, folderName, className, size, ...other } = props;


 

    return (
        <>
                                            {strings.tips.quick}<br />

                                            {this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined && 
                                            <>
                                            {strings.move.damage + (this.props.moveTable[this.props.value.QuickMove].Damage)}<br />
                                            {strings.move.energy + (this.props.moveTable[this.props.value.QuickMove].Energy)}<br />
                                            {"Cooldown: " + (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)}<br />
                                            {"DPS: " + (this.props.moveTable[this.props.value.QuickMove].Damage /
                                                    (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                                            {"EPS: " + (this.props.moveTable[this.props.value.QuickMove].Energy /
                                                    (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                                            </>}
        </>
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