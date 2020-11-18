import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import URI from "App/PvP/components/URI/URI";
import MagicBox from "App/PvP/components/MagicBox/MagicBox";
import DoubleSlider from "App/Movedex/MoveCard/DoubleSlider/DoubleSlider";
import Breakpoints from "./Breakpoints/Breakpoints";
import PveWillow from "./PveWillow/PveWillow";
import PveResListFilter from "./PveResListFilter/PveResListFilter";
import Switch from "App/Components/Switch/Switch";
import PlayerResProcessor from "./PlayerResProcessor/PlayerResProcessor";
import PveResTitle from "./PveResTitle/PveResTitle";

import { locale } from "locale/Pve/Pve";
import { getCookie } from "js/getCookie";

let pvestrings = new LocalizedStrings(locale);

class PveResult extends React.PureComponent {
    constructor() {
        super();
        this.pveres = React.createRef();

        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            n: 0,
            showBreakpoints: false,
            breakpObj: {},

            param: "damage",
            filter: {}
        };

        this.showBreakpoints = this.showBreakpoints.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onFilter = this.onFilter.bind(this);

        this.loadMore = this.loadMore.bind(this);

        this.focusDiv = this.focusDiv.bind(this);
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.generateList()
        this.focusDiv();
    };
    componentDidUpdate(prevProps) {
        if (this.props.date === prevProps.date) {
            return
        }
        this.generateList()
        this.focusDiv();
    };

    focusDiv() {
        this.pveres.current.focus();
    };

    generateList() {
        this.setState({
            n: 1,
        })
    }

    loadMore() {
        this.setState({
            n: this.props.result.length >= (this.state.n + 1) * 25 ? (this.state.n + 1) : this.state.n,
        })
    }

    onSortChange(event, attributes) {
        this.setState({
            param: attributes.attr,
        })
    }

    onFilter(event, attributes) {
        this.setState({
            filter: {
                ...this.state.filter,
                [attributes.attr]: !this.state.filter[attributes.attr],
            },
        })
    }

    showBreakpoints(obj) {
        this.setState({
            showBreakpoints: true,
            breakpObj: obj,
        })
    }

    onClose = () => {
        this.setState({
            showBreakpoints: false,
        })
    }

    render() {

        return (
            <Grid container justify="center" spacing={2}>

                <MagicBox open={this.state.showBreakpoints} onClick={this.onClose} attr={"breakpoints"}>
                    <Breakpoints pokemonTable={this.props.pokemonTable} moveTable={this.props.moveTable} snapshot={this.state.breakpObj} />
                </MagicBox>

                <Grid item xs={12}>
                    <PveWillow
                        pokemonTable={this.props.pokemonTable}
                        snapshot={this.props.snapshot}
                    />
                </Grid>

                {this.props.url &&
                    <Grid item xs={12}>
                        <URI value={this.props.url} />
                    </Grid>}

                {!this.props.customResult &&
                    <Grid item xs={12}>
                        <DoubleSlider
                            onClick={this.onSortChange}
                            attrs={["damage", "dps"]}
                            titles={[pvestrings.sortd, pvestrings.sortdps]}
                            active={[this.state.param === "damage", this.state.param === "dps"]}
                        />
                    </Grid>}

                {!this.props.customResult &&
                    <Grid item xs={12} container justify="center">
                        <Switch
                            checked={Boolean(this.state.filter.unique)}
                            onChange={this.onFilter}
                            attr="unique"
                            color="primary"
                            label={pvestrings.unique}
                        />
                    </Grid>}

                <div aria-label="focus div" ref={this.pveres} tabIndex="0"></div>

                {this.props.needsAvg &&
                    <>
                        <Grid item xs={12}>
                            <PveResTitle>
                                {`${pvestrings.resType.player}:`}
                            </PveResTitle>
                        </Grid>

                        <Grid item xs={12}>
                            <PlayerResProcessor
                                value={this.props.result}

                                snapshot={this.props.snapshot}
                                tables={this.props.tables}

                                pokemonTable={this.props.pokemonTable}
                                moveTable={this.props.moveTable}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <PveResTitle>
                                {`${pvestrings.resType.individ}:`}
                            </PveResTitle>
                        </Grid>
                    </>}

                <Grid item xs={12}>
                    <PveResListFilter
                        needsAvg={this.props.needsAvg}
                        n={this.state.n}
                        customResult={this.props.customResult}

                        snapshot={this.props.snapshot}
                        tables={this.props.tables}

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}

                        filter={this.state.filter}
                        sort={this.state.param}

                        showBreakpoints={this.showBreakpoints}
                        loadMore={this.loadMore}
                    >
                        {this.props.result}
                    </PveResListFilter>
                </Grid>

            </Grid>
        )
    }

}

export default PveResult;

PveResult.propTypes = {
    customResult: PropTypes.bool,
    needsAvg: PropTypes.bool,

    date: PropTypes.number,
    result: PropTypes.arrayOf(PropTypes.object),

    snapshot: PropTypes.object,
    tables: PropTypes.object,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    pokList: PropTypes.arrayOf(PropTypes.object),
    boostersList: PropTypes.arrayOf(PropTypes.object),
    chargeMoveList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),
};