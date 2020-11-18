import React from "react"
import SiteHelm from "App/SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import GetAppIcon from '@material-ui/icons/GetApp';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import { getMoveBase } from "AppStore/Actions/getMoveBase";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import RatingPages from "./RatingPages/RatingPages";
import Button from "App/Components/Button/Button";
import WithIcon from "App/Components/WithIcon/WithIcon";
import RatingDescr from "./RatingDescr/RatingDescr";
import DropWithArrow from "./DropWithArrow/DropWithArrow";
import Input from "App/Components/Input/Input";

import { capitalizeFirst } from "js/capitalizeFirst";
import { getCookie } from "js/getCookie";
import { locale } from "locale/Rating/Rating";
import { options } from "locale/Components/Options/locale";

let strings = new LocalizedStrings(locale)
let optionStrings = new LocalizedStrings(options)


class PvpRating extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            ratingList: [],

            name: "",
            n: 0,
            league: "Great",
            combination: "overall",

            error: "",
            showResult: false,
            isError: false,
            loading: false,
            isNextPage: false,
            searchState: false,
        };
        this.updateState = this.updateState.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        let obj = this.returnUpdObj(this.props.match.params.league ? capitalizeFirst(this.props.match.params.league) : "",
            this.props.match.params.type ? String(this.props.match.params.type) : "")
        this.updateState(obj.defaultLeague, obj.defaultType, obj.defaultPath)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.league === this.props.match.params.league &&
            prevProps.match.params.type === this.props.match.params.type) {
            return
        }
        let obj = this.returnUpdObj(this.props.match.params.league ? capitalizeFirst(this.props.match.params.league) : "",
            this.props.match.params.type ? String(this.props.match.params.type) : "")
        this.updateState(obj.defaultLeague, obj.defaultType, obj.defaultPath)
    }

    returnUpdObj(leagueString, typeString) {
        let obj = {
            defaultLeague: "Great",
            defaultType: "overall",
            defaultPath: "Great",
        }
        if (leagueString && typeString) {
            obj.defaultPath = leagueString + (typeString === "overall" ? "" : typeString)
            obj.defaultLeague = leagueString
            obj.defaultType = typeString
        }
        return obj
    }

    async updateState(defaultLeague, defaultType, defaultPath) {
        this.setState({
            league: defaultLeague,
            combination: defaultType,
            loading: true,
        })
        try {
            let fetches = [
                this.props.getPokemonBase(),
                this.props.getMoveBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/rating/" + defaultPath, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ]

            let responses = await Promise.all(fetches)

            let result = await responses[2].json()

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 2 ? result.detail : responses[i].detail) }
            }

            this.setState({
                n: 75,
                isNextPage: result.length - 75 > 0,

                showResult: true,
                isError: false,
                loading: false,

                ratingList: result.map((value, i) => { value.rank = i + 1; return value }),
            })

        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e)
            })
        }

    }

    onLoadMore() {
        let newN = (this.state.n + 75) <= this.state.ratingList.length ? this.state.n + 75 : this.state.ratingList.length
        this.setState({
            n: newN,
            isNextPage: this.state.ratingList.length - newN > 0,
        });
    }

    onChangeInput(event) {
        this.setState({
            name: !event.target.value ? "" : event.target.value,
            searchState: !event.target.value ? false : true,
        });
    }

    async onChange(event) {
        switch (event.target.name === "league") {
            case true:
                var leaguePath = event.target.value
                var typePath = this.state.combination
                var typeOfrating = leaguePath + ((typePath === "overall") ? "" : typePath)
                break
            default:
                leaguePath = this.state.league
                typePath = event.target.value
                typeOfrating = leaguePath + ((typePath === "overall") ? "" : typePath)
                break
        }
        this.setState({
            [event.target.name]: event.target.value,
            error: "",
            showResult: false,
            isError: false,
            loading: true,
            isNextPage: false,
            searchState: false,

        });


        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/rating/" + typeOfrating, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.props.history.push("/pvprating/" + leaguePath.toLowerCase() + "/" + typePath)
            this.setState({
                n: 75,
                isNextPage: result.length - 75 > 0,

                showResult: true,
                isError: false,
                loading: false,
                searchState: false,

                ratingList: result,
            })

        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e)
            })
        }
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/pvprating"
                    header={strings.pageheaders.pvprating}
                    descr={strings.pagedescriptions.pvprating}
                />
                <Grid item xs={12} sm={10} md={8} lg={6} container justify="center" spacing={2} >

                    <Grid item xs={12}>
                        <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
                            <Grid container justify="center" spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Input select label={strings.league} name="league"
                                        value={this.state.league} onChange={this.onChange}>

                                        <MenuItem value="Great" >{optionStrings.options.league.great}</MenuItem>
                                        <MenuItem value="Ultra" >{optionStrings.options.league.ultra}</MenuItem>
                                        <MenuItem value="Master">{optionStrings.options.league.master}</MenuItem>
                                        <MenuItem value="Premierultra" >{optionStrings.options.league.premierUltra}</MenuItem>
                                        <MenuItem value="Cupflying" >{"Flying Cup"}</MenuItem>
                                        <MenuItem value="Premier" >{optionStrings.options.league.premier}</MenuItem>

                                    </Input>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <WithIcon tip={<>{strings.rating.firstsent}<br />{strings.rating.secondsent}<br />{strings.rating.thirdsent}</>}>

                                        <Input select label={strings.rating.ratingType} name="combination"
                                            value={this.state.combination} onChange={this.onChange}>

                                            <MenuItem value="overall" >{strings.overall}</MenuItem>
                                            <MenuItem value="00" >{strings.rating.sheilds + " 0 x 0"}</MenuItem>
                                            <MenuItem value="11" >{strings.rating.sheilds + " 1 x 1"}</MenuItem>
                                            <MenuItem value="22" >{strings.rating.sheilds + " 2 x 2"}</MenuItem>
                                            <MenuItem value="01" >{strings.rating.sheilds + " 0 x 1"}</MenuItem>
                                            <MenuItem value="12" >{strings.rating.sheilds + " 1 x 2"}</MenuItem>

                                        </Input>

                                    </WithIcon>
                                </Grid>
                            </Grid>
                        </GreyPaper>
                    </Grid>

                    <Grid item xs={12}>
                        <GreyPaper elevation={4} enablePadding paddingMult={0.75}>
                            <DropWithArrow title={strings.aboutrate}>
                                <RatingDescr />
                            </DropWithArrow>
                        </GreyPaper>
                    </Grid>


                    <Grid item xs={12}>
                        <GreyPaper elevation={4} enablePadding>
                            <Grid container justify="center" spacing={2}>

                                {this.state.loading &&
                                    <Grid item xs={12}>
                                        <LinearProgress color="secondary" />
                                    </ Grid>}

                                {this.state.isError &&
                                    <Grid item xs={12}>
                                        <Alert variant="filled" severity="error">{this.state.error}</Alert >
                                    </ Grid>}

                                {this.state.showResult && <>
                                    <Grid item xs={12}>
                                        <Input
                                            value={this.state.name}
                                            onChange={this.onChangeInput}
                                            label={strings.searchplaceholder}
                                        />
                                    </ Grid>

                                    <Grid item xs={12}>
                                        <RatingPages
                                            name={this.state.name}
                                            n={this.state.n}
                                            league={this.state.league}
                                            combination={this.state.combination}
                                            pokemonTable={this.props.bases.pokemonBase}
                                            moveTable={this.props.bases.moveBase}
                                            searchState={this.state.searchState}
                                            originalList={this.state.ratingList}
                                        >
                                            {this.state.ratingList}
                                        </RatingPages>
                                    </ Grid>
                                </>}

                                {(this.state.isNextPage && !this.state.searchState) &&
                                    <Grid item container xs={12} justify="center">
                                        <Button title={strings.loadmore} endIcon={<GetAppIcon />} onClick={this.onLoadMore} />
                                    </Grid>}

                            </Grid>
                        </GreyPaper>
                    </Grid>

                </Grid>
            </Grid>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
        getMoveBase: () => dispatch(getMoveBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(PvpRating)