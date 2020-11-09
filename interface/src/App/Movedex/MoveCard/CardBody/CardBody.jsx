import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';

import TableWithTitle from "./TableWithTitle/TableWithTitle"
import CommonPve from "./CommonPve/CommonPve";
import CommonPvp from "./CommonPvp/CommonPvp";
import ChargeMovePve from "./ChargeMove/ChargeMovePve";
import ChargeMovePvp from "./ChargeMove/ChargeMovePvp";
import QuickMovePve from "./QuickMove/QuickMovePve";
import QuickMovePvp from "./QuickMove/QuickMovePvp";
import MovedexChargeEnergy from "./MovedexChargeEnergy/MovedexChargeEnergy"

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Movedex/Movecard";

let strings = new LocalizedStrings(dexLocale);

const CardBody = React.memo(function CardBody(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const { MoveCategory } = props

    return (
        <Grid container justify="center" spacing={1}>
            <Grid item xs={12} sm={6}>

                <TableWithTitle title={strings.movecard.pve}>
                    <CommonPve move={props.move} energy={MoveCategory === "Charge Move" ? <MovedexChargeEnergy move={props.move} /> : props.move.Energy} />

                    {MoveCategory === "Charge Move" ?
                        <ChargeMovePve move={props.move} />
                        :
                        <QuickMovePve move={props.move} />}

                </TableWithTitle>

            </Grid>

            <Grid item xs={12} sm={6}>

                <TableWithTitle title={strings.movecard.pve}>
                    <CommonPvp energy={props.move.Energy} move={props.move} />

                    {MoveCategory === "Charge Move" ?
                        <ChargeMovePvp move={props.move} />
                        :
                        <QuickMovePvp move={props.move} />}

                </TableWithTitle>

            </Grid>
        </Grid>
    )

});

export default CardBody;
