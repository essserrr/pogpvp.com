import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import RenderEggList from "./RenderEggList/RenderEggList";
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock";
import SingleSliderButton from "./SingleSliderButton/SingleSliderButton";

import { getCookie } from "js/getCookie";
import { locale } from "locale/Eggs/Eggs";

let strings = new LocalizedStrings(locale);

class EggsList extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            isError: false,
            error: "",
            loading: false,

            filter: {
                showReg: false,
            },
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        //get pok and eggs db
        try {
            let fetches = [
                this.props.getPokemonBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/eggs", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ];

            let responses = await Promise.all(fetches)
            let result = await responses[1].json()

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 1 ? result.detail : responses[i].detail) }
            }

            this.setState({
                isError: false,
                loading: false,
                tierList: result,
            })

        } catch (e) {
            this.setState({
                isError: true,
                loading: false,
                error: String(e)
            })
        }
    }

    onChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: !Boolean(this.state.filter[attr])
            }
        })
    }

    filter(elem, filter) {
        if (!filter) {
            return true
        }
        let filterProduct = Object.entries(filter).reduce((sum, value) => { return value[0].includes("eggs") ? sum * !value[1] : sum }, true)
        if (filterProduct) { return true }
        return filter[elem.key]
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/eggs"
                    header={strings.pageheaders.eggs}
                    descr={strings.pagedescriptions.eggs}
                />

                <Grid item xs={12} md={11} lg={8}>
                    <GreyPaper elevation={4} enablePadding>
                        <Grid container justify="center" spacing={2}>

                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            {this.state.isError &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">{this.state.error}</Alert >
                                </Grid>}

                            {this.state.tierList &&
                                <>
                                    <Grid item xs={12}>
                                        <ButtonsBlock
                                            filter={this.state.filter}
                                            onFilter={this.onChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container justify="center">
                                            <Grid item xs={12} sm={6}>
                                                <SingleSliderButton
                                                    attr="showReg"
                                                    title={strings.tierlist.regionals}
                                                    isActive={this.state.filter.showReg}
                                                    onClick={this.onChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>}

                            {this.state.tierList &&
                                <Grid item xs={12}>
                                    <RenderEggList
                                        pokTable={this.props.bases.pokemonBase}
                                        filter={this.state.filter}
                                    >
                                        {this.state.tierList}
                                    </RenderEggList>
                                </Grid>}

                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(EggsList)






