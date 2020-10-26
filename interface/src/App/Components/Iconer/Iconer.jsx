import React from "react";
import PropTypes from 'prop-types';

const Iconer = React.memo(function Iconer(props) {
    const { fileName, folderName, className, size, ...other } = props;

    //if we are looking for a pokemon icon
    let iconList = ["/images/low/",]
    let i = 0

    function addDefaultSrc(event) {
        switch (folderName === "/art/") {
            case true:
                if (i === 0) {
                    let withoutForme = fileName.split("-")
                    event.target.src = "/images" + folderName + withoutForme[0] + ".jpg"
                }
                if (i === 1) {
                    event.target.src = iconList[0] + fileName + ".png"
                }
                if (i === 2) {
                    event.target.src = "/images/missingno.png"
                }
                i++
                break
            default:
                event.target.src = "/images/missingno.png"
                break
        }
    }

    console.log(`/images${folderName}${fileName}.${folderName === "/art/" ? "jpg" : "png"}`)
    return (
        navigator.userAgent !== "ReactSnap" &&
        <img
            src={`/images${folderName}${fileName}.${folderName === "/art/" ? "jpg" : "png"}`}
            onError={addDefaultSrc}
            className={className}
            style={{ width: `${!!size ? `${size}px` : "auto"}`, height: `${!!size ? `${size}px` : "auto"}`, }}
            alt=""
            {...other}
        />
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