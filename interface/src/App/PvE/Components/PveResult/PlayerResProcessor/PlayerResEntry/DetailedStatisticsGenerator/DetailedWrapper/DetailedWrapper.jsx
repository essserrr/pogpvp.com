import React from "react"

import StatisticsSet from "../../StatisticsSet/StatisticsSet"
import CollapseCard from "../../../../PveResListFilter/PveResListSort/PveResListRender/PveResEntry/CollapseCardWrapper/CollapseCard/CollapseCard"

const DetailedWrapper = React.memo(function (props) {
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