import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import { getMoveBase } from "../../AppStore/Actions/getMoveBase"
import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import RatingPages from "./RatingPages/RatingPages"
import SubmitButton from "../PvP/components/SubmitButton/SubmitButton"
import SelectGroup from "../PvP/components/SelectGroup/SelectGroup"
import RatingDescr from "./RatingDescr/RatingDescr"
import DropWithArrow from "./DropWithArrow/DropWithArrow"
import Input from "../PvP/components/Input/Input"

import { capitalizeFirst } from "../../js/indexFunctions"
import { getCookie } from "../../js/getCookie"
import { locale } from "locale/Rating/Rating";
import { options } from "locale/Components/Options/locale";

import "./PvpRating.scss"

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

            leagueList: [
                <option value="Great" key="Great">{optionStrings.options.league.great}</option>,
                <option value="Ultra" key="Ultra">{optionStrings.options.league.ultra}</option>,
                <option value="Master" key="Master">{optionStrings.options.league.master}</option>,
                <option value="Premierultra" key="Premierultra">{optionStrings.options.league.premierUltra}</option>,
                <option value="Cupflying" key="Cupflying">{"Flying Cup"}</option>,
                <option value="Premier" key="Premier">{optionStrings.options.league.premier}</option>,
            ],
            combinationList: [
                <option value="overall" key="overall">{strings.overall}</option>,
                <option value="00" key="00">{strings.rating.sheilds + " 0 x 0"}</option>,
                <option value="11" key="11">{strings.rating.sheilds + " 1 x 1"}</option>,
                <option value="22" key="22">{strings.rating.sheilds + " 2 x 2"}</option>,
                <option value="01" key="01">{strings.rating.sheilds + " 0 x 1"}</option>,
                <option value="12" key="12">{strings.rating.sheilds + " 1 x 2"}</option>,
            ],

            showDescription: false,
        };
        this.updateState = this.updateState.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onShowDescr = this.onShowDescr.bind(this);
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
        if (!event.target.value) {
            this.setState({
                name: "",
                searchState: false,
            });
            return
        }
        this.setState({
            name: event.target.value,
            searchState: true,
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

    onShowDescr() {
        this.setState({
            showDescription: !this.state.showDescription,
        })
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/pvprating"
                    header={strings.pageheaders.pvprating}
                    descr={strings.pagedescriptions.pvprating}
                />
                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Grid container justify="center" spacing={2} >

                        <Grid item xs={12}>
                            <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
                                <Grid container justify="center" spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <SelectGroup
                                            class="input-group input-group-sm p-0 m-0"
                                            name="league"
                                            value={this.state.league}
                                            onChange={this.onChange}
                                            options={this.state.leagueList}
                                            label={strings.league}
                                            for=""
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <SelectGroup
                                            class="input-group input-group-sm "
                                            name="combination"
                                            value={this.state.combination}
                                            onChange={this.onChange}
                                            options={this.state.combinationList}
                                            label={strings.rating.ratingType}

                                            place={"bottom"}
                                            for={"rating"}
                                            tip={<>
                                                {strings.rating.firstsent}
                                                <br />
                                                <br />
                                                {strings.rating.secondsent}
                                                <br />
                                                <br />
                                                {strings.rating.thirdsent}
                                            </>}
                                            tipClass="infoTip"
                                        />
                                    </Grid>
                                </Grid>
                            </GreyPaper>
                        </Grid>

                        <Grid item xs={12}>
                            <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
                                <DropWithArrow
                                    onShow={this.onShowDescr}
                                    show={this.state.showDescription}
                                    title={strings.aboutrate}
                                    elem={<RatingDescr />}

                                    faOpened="align-self-center fas fa-angle-up fa-lg "
                                    faClosed="align-self-center fas fa-angle-down fa-lg"
                                    outClass="col-12 d-flex justify-content-between p-0 pb-1 clickable"
                                    inClass="row justify-content-center m-0" />
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
                                                class="pvp-rating--border form-control"
                                                onChange={this.onChangeInput}
                                                place={strings.searchplaceholder}
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

                                    {(this.state.isNextPage && !this.state.searchState) && <Grid item container xs={12} justify="center">

                                        <SubmitButton
                                            action="Load more"
                                            onSubmit={this.onLoadMore}
                                            class="submit-button--lg btn btn-primary btn-sm"
                                        >
                                            {strings.loadmore}
                                        </SubmitButton>
                                    </Grid>}

                                </Grid>
                            </GreyPaper>
                        </Grid>

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