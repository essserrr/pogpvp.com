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
        this.drawTriangle()
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
    render() {
        return (
            <div className="col-12 m-0 p-0 mt-1 jystify-content-center">
                <canvas id="myCanvas" ref="canvas" width={150} height={129} />
            </div>
        );
    }
}

export default StatsTriangle;