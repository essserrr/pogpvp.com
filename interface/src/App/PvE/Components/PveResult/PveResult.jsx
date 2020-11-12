import React from "react"
import LocalizedStrings from "react-localization"

import Grid from '@material-ui/core/Grid';

import URL from "../../../PvP/components/URL/URL"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import DoubleSlider from "../../../Movedex/MoveCard/DoubleSlider/DoubleSlider"
import Breakpoints from "./Breakpoints/Breakpoints"
import PveWillow from "./PveWillow/PveWillow"
import PveResListFilter from "./PveResListFilter/PveResListFilter"
import Switch from "App/Components/Switch/Switch";
import PlayerResProcessor from "./PlayerResProcessor/PlayerResProcessor"
import PveResTitle from "./PveResTitle/PveResTitle"

import { locale } from "../../../../locale/locale"
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from "../../../../js/getCookie"

import "./PveResult.scss"

let strings = new LocalizedStrings(locale)
let pvestrings = new LocalizedStrings(pveLocale)

class PveResult extends React.PureComponent {
    constructor(props) {
        super(props);
        this.pveres = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            n: 0,
            breakpoints: false,

            param: "damage",
            filter: {}
        };


        this.onClick = this.onClick.bind(this);
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

    onSortChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            param: attr,
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

    onClick(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        this.setState({
            showBreakpoints: false,
        });
    }

    render() {
        return (
            <Grid container justify="center" spacing={2}>
                {(this.state.showBreakpoints) &&
                    <MagicBox
                        onClick={this.onClick}
                        attr={"breakpoints"}
                        element={<Breakpoints
                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.moveTable}
                            snapshot={this.state.breakpObj}
                        />}
                    />}

                <Grid item xs={12} ref={this.pveres}>
                    <PveWillow
                        pokemonTable={this.props.pokemonTable}
                        snapshot={this.props.snapshot}
                    />
                </Grid>

                {this.props.url &&
                    <Grid item xs={12}>
                        <URL
                            label={strings.title.url}
                            for="pvpURLLabel"
                            tip={<>
                                {strings.tips.url.first}
                                < br />
                                {strings.tips.url.second}
                            </>}
                            place="top"
                            message={strings.tips.url.message}
                            value={this.props.url}
                        />
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

                        list={this.props.result}
                        raplace={this.raplace}
                        showBreakpoints={this.showBreakpoints}
                        loadMore={this.loadMore}
                    />
                </Grid>

            </Grid>
        )
    }

}


export default PveResult;