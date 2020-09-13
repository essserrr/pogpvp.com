import React from "react"
import LocalizedStrings from "react-localization"
import ReactTooltip from "react-tooltip"

import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"

import "./StatsTriangle.scss"

let strings = new LocalizedStrings(dexLocale);

class StatsTriangle extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    componentDidMount() {
        // this.drawTriangle()
    }
    drawTriangle() {
        let canvas = this.refs.canvas
        const context = this.refs.canvas.getContext('2d')

        const stroke = 2.5
        const height = (canvas.width - stroke * 2) * Math.cos(Math.PI / 6)
        const center = 2 / 3 * height

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.beginPath();
        //0.0
        context.moveTo(stroke, canvas.height - stroke);
        //w.0
        context.lineTo(canvas.width - stroke, canvas.height - stroke);
        //w/2.h
        context.lineTo(canvas.width / 2, canvas.height - height);
        context.closePath();

        context.lineWidth = stroke;
        context.strokeStyle = 'black';
        context.stroke();

        context.beginPath();
        context.setLineDash([15, 5]);
        context.moveTo(stroke, canvas.height - stroke);
        //center
        context.lineTo(canvas.width / 2, center);
        //w/2.h
        context.lineTo(canvas.width / 2, canvas.height - height);
        //w.0
        context.moveTo(canvas.width - stroke, canvas.height - stroke);
        //center
        context.lineTo(canvas.width / 2, center);

        // the outline
        context.lineWidth = stroke;
        context.strokeStyle = 'red';
        context.stroke();

        context.fill();

    }

    returnTriangle() {
        //initial values
        const strokeMain = this.props.strokeMain
        const strokeSec = this.props.strokeSec
        const width = this.props.boxWidth
        const height = this.props.boxHeight
        //triangle measures
        const triangleLength = this.props.length
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

        const ratioAtk = this.props.value.Atk / (this.props.value.Atk > 414 ? this.props.value.Atk : 414)
        const ratioDef = this.props.value.Def / (this.props.value.Def > 420 ? this.props.value.Def : 420)
        const ratioSta = this.props.value.Sta / (this.props.value.Sta > 420 ? this.props.value.Sta : 420)

        return <>
            <path d={"M" + leftX + " " + leftY + " H " + rightX + " L " + topX + " " + topY + " Z"}
                fill="transparent" stroke="black" strokeWidth={strokeMain} />
            <path d={"M" + leftX + " " + leftY + "L " + centerX + " " + centerY + " L " + rightX + " " + rightY +
                "M" + centerX + " " + centerY + " L " + topX + " " + topY}
                fill="transparent" stroke="black" strokeWidth={strokeSec} strokeDasharray="5 2" />

            <path data-tip data-for={"all"} className={"stats-trangle svgFillsC" + this.props.value.Type[0]} style={{ opacity: "0.85" }}
                d={"M" + (centerX + (leftX - centerX) * ratioAtk) + " " + (centerY + (leftY - centerY) * ratioAtk) +
                    " L " + (centerX + (rightX - centerX) * ratioDef) + " " + (centerY + (rightY - centerY) * ratioDef) +
                    " L " + (centerX + (topX - centerX) * ratioDef) + " " + (centerY + (topY - centerY) * ratioSta) + " Z"}
                fill="transparent" />
            <text data-tip data-for={"atk"} x={leftX - 25} y={leftY} className="fBolder">Atk</text>
            <text data-tip data-for={"def"} x={rightX} y={rightY} className="fBolder">Def</text>
            <text data-tip data-for={"sta"} x={topX - 25 / 2} y={topY - 2} className="fBolder">Sta</text>
        </>
    }

    render() {
        return (
            <>
                <ReactTooltip
                    className={"infoTip"}
                    id={"sta"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {strings.staFull + ": " + this.props.value.Sta}
                </ReactTooltip>
                <ReactTooltip
                    className={"infoTip"}
                    id={"atk"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {strings.atkFull + ": " + this.props.value.Atk}
                </ReactTooltip>
                <ReactTooltip
                    className={"infoTip"}
                    id={"def"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {strings.defFull + ": " + this.props.value.Def}
                </ReactTooltip>
                <ReactTooltip
                    className={"infoTip"}
                    id={"all"} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {strings.atkFull + ": " + this.props.value.Atk}<br />
                    {strings.defFull + ": " + this.props.value.Def}<br />
                    {strings.staFull + ": " + this.props.value.Sta}<br />
                </ReactTooltip>
                <svg
                    width={this.props.boxWidth} height={this.props.boxHeight} >
                    {this.returnTriangle()}
                </svg>
            </>
        );
    }
}

export default StatsTriangle;