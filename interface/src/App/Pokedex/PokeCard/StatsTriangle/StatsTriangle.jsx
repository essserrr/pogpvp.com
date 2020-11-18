import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Components/StatsTriangle/StatsTriangle";

const useStyles = props => makeStyles(theme => {
    return ({
        moveColor: {
            fill: theme.palette.types[`type${props.type}`].background,
            opacity: "0.85",

            "-webkit-transition": "all 0.4s linear",
            transition: "all 0.4s linear",

            cursor: "pointer",
        },
        font: {
            fontWeight: "bold",
            cursor: "pointer",
        }
    })
});

let strings = new LocalizedStrings(dexLocale);

const StatsTriangle = React.memo(function StatsTriangle(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles({ type: props.value.Type[0] })();

    //initial values
    const strokeMain = props.strokeMain
    const strokeSec = props.strokeSec
    const width = props.boxWidth
    const height = props.boxHeight
    //triangle measures
    const triangleLength = props.length
    const triangleHeight = (triangleLength) * Math.cos(Math.PI / 6)
    const padding = (width - triangleLength) > 0 ? (width - triangleLength) / 2 : 0
    //triangle points
    const centerX = width / 2
    const centerY = height - 1 / 3 * triangleHeight
    const topY = height - triangleHeight
    const topX = centerX
    const leftY = height - strokeMain
    const leftX = strokeMain + padding
    const rightY = leftY
    const rightX = width - strokeMain - padding

    const ratioAtk = props.value.Atk / (props.value.Atk > 414 ? props.value.Atk : 414)
    const ratioDef = props.value.Def / (props.value.Def > 420 ? props.value.Def : 420)
    const ratioSta = props.value.Sta / (props.value.Sta > 420 ? props.value.Sta : 420)


    return (
        <svg width={props.boxWidth} height={props.boxHeight} >

            <path d={`M${leftX} ${leftY} H ${rightX} L ${topX} ${topY} Z`}
                fill="transparent" stroke="black" strokeWidth={strokeMain} />

            <path d={`M${leftX} ${leftY}L ${centerX} ${centerY} L ${rightX} ${rightY}M${centerX} ${centerY} L ${topX} ${topY}`}
                fill="transparent" stroke="black" strokeWidth={strokeSec} strokeDasharray="5 2" />

            <Tooltip placement="top" arrow
                title={
                    <Typography>
                        {`${strings.atkFull}: ${props.value.Atk}`}<br />
                        {`${strings.defFull}: ${props.value.Def}`}<br />
                        {`${strings.staFull}: ${props.value.Sta}`}<br />
                    </Typography>}>

                <path className={classes.moveColor}

                    d={`M${centerX + (leftX - centerX) * ratioAtk} ${centerY + (leftY - centerY) * ratioAtk}
                L ${centerX + (rightX - centerX) * ratioDef} ${centerY + (rightY - centerY) * ratioDef}
                L ${centerX + (topX - centerX) * ratioDef} ${centerY + (topY - centerY) * ratioSta} Z`}
                    fill="transparent" />

            </Tooltip>


            <Tooltip placement="top" arrow
                title={<Typography>{`${strings.atkFull}: ${props.value.Atk}`}</Typography>}>
                <text x={leftX - 25} y={leftY} className={classes.font}>Atk</text>
            </Tooltip>
            <Tooltip placement="top" arrow
                title={<Typography>{`${strings.defFull}: ${props.value.Def}`}</Typography>}>
                <text x={rightX} y={rightY} className={classes.font}>Def</text>
            </Tooltip>
            <Tooltip placement="top" arrow
                title={<Typography>{`${strings.staFull}: ${props.value.Sta}`}</Typography>}>
                <text x={topX - 25 / 2} y={topY - 2} className={classes.font}>Sta</text>
            </Tooltip>

        </svg>
    )
});

export default StatsTriangle;

StatsTriangle.propTypes = {
    strokeMain: PropTypes.number,
    strokeSec: PropTypes.number,
    boxWidth: PropTypes.number,
    boxHeight: PropTypes.number,
    length: PropTypes.number,
    value: PropTypes.object,
};