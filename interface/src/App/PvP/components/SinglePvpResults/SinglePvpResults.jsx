import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import Line from "./Line";
import Head from "./Head";
import Rate from "./Rate/Rate";

import { res } from "locale/Pvp/ResultTable/ResultTable";

import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(res)

const SinglePvpResults = React.memo(function SinglePvpResults(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { Defender, Attacker } = props.value;

    return (
        <Table>
            <Head NameA={Attacker.Name} NameD={Defender.Name} />

            <TableBody>

                <Line
                    title={strings.resultTable.rate}
                    valueA={
                        <Rate value={Attacker.Rate}>
                            <i className="fas fa-trophy"></i>
                        </Rate>}
                    valueD={
                        <Rate value={Defender.Rate}>
                            <i className="fas fa-trophy"></i>
                        </Rate>}
                />
                <Line
                    title={strings.resultTable.hpRes}
                    valueA={`${Attacker.MaxHP}/${Attacker.HP}`}
                    valueD={`${Defender.MaxHP}/${Defender.HP}`}
                />
                <Line
                    title={strings.resultTable.damageRes}
                    valueA={`${Attacker.MaxHP - Attacker.HP}/${Defender.DamageBlocked}`}
                    valueD={`${Defender.MaxHP - Defender.HP}/${Attacker.DamageBlocked}`}
                />
                <Line
                    title={strings.resultTable.energyRes}
                    valueA={`${Attacker.EnergyRemained + Attacker.EnergyUsed}/${Attacker.EnergyUsed}`}
                    valueD={`${Defender.EnergyRemained + Defender.EnergyUsed}/${Defender.EnergyUsed}`}
                />

            </TableBody>
        </Table>
    )
});

export default SinglePvpResults;

SinglePvpResults.propTypes = {
    value: PropTypes.object,
};