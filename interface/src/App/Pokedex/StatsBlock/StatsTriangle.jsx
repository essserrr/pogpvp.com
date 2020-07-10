import React from "react";
import LocalizedStrings from "react-localization";

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

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
        const strokeMain = this.props.strokeMain ? this.props.strokeMain : 1.5
        const strokeSec = this.props.strokeSec ? this.props.strokeSec : 1
        const width = this.props.width ? this.props.width : 150
        const height = this.props.width ? this.props.width : 130
        const triangleHeight = (width - strokeMain * 2) * Math.cos(Math.PI / 6)
        //triangle points
        const centerX = width / 2
        const centerY = (height - triangleHeight) + 2 / 3 * triangleHeight
        const topY = height - triangleHeight
        const topX = centerX
        const leftY = height - strokeMain
        const leftX = strokeMain
        const rightY = leftY
        const rightX = width - strokeMain

        const ratioAtk = this.props.value.Atk / 414
        const ratioDef = this.props.value.Def / 505
        const ratioSta = this.props.value.Sta / 496

        return <>
            <path d={"M" + leftX + " " + leftY + " H " + rightX + " L " + topX + " " + topY + " Z"}
                fill="transparent" stroke="black" strokeWidth={strokeMain} />
            <path d={"M" + leftX + " " + leftY + "L " + centerX + " " + centerY + " L " + rightX + " " + rightY +
                "M" + centerX + " " + centerY + " L " + topX + " " + topY}
                fill="transparent" stroke="black" strokeWidth={strokeSec} strokeDasharray="5 2" />

            <path className={"statBarXXBack svgFillsC" + this.props.value.Type[0]} style={{ opacity: "0.85" }}
                d={"M" + (centerX + (leftX - centerX) * ratioAtk) + " " + (centerY + (leftY - centerY) * ratioAtk) +
                    " L " + (centerX + (rightX - centerX) * ratioDef) + " " + (centerY + (rightY - centerY) * ratioDef) +
                    " L " + (centerX + (topX - centerX) * ratioDef) + " " + (centerY + (topY - centerY) * ratioSta) + " Z"}
                fill="transparent" />
        </>
    }
    render() {
        return (
            <div className="col-12 m-0 p-0 mt-1 jystify-content-center">
                <svg tabIndex="0" ref="canvas" width="150px" height="130px" >
                    {this.returnTriangle()}
                </svg>
            </div>
        );
    }
}

export default StatsTriangle;