import React from "react";
import PropTypes from 'prop-types';

import StatisticsSet from "../../StatisticsSet/StatisticsSet";
import CollapseCard from "App/PvE/Components/PveResult/PveResListFilter/PveResListSort/PveResListRender/PveResEntry/CollapseCardWrapper/CollapseCard/CollapseCard";

const DetailedWrapper = React.memo(function DetailedWrapper(props) {
    return (
        <CollapseCard
            pokQick={props.moveTable[props.value.boss.quick]}
            pokCh={props.moveTable[props.value.boss.charge]}
            weather={props.snapshot.pveObj.Weather}
        >
            <StatisticsSet {...props} />
        </CollapseCard>
    )
});

export default DetailedWrapper;

DetailedWrapper.propTypes = {
    value: PropTypes.object,
    disabled: PropTypes.object,

    tables: PropTypes.object,
    moveTable: PropTypes.object,
    snapshot: PropTypes.object,
};