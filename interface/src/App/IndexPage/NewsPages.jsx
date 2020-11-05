import React from "react";
import LocalizedStrings from "react-localization";
import SiteHelm from "App/SiteHelm/SiteHelm";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import NewsList from "./NewsList/NewsList"
import NavigationBlock from "App/Pokedex/PokeCard/NavigationBlock/NavigationBlock"
import IndexPageTitle from "./IndexPageTitle/IndexPageTitle"

import { locale } from "locale/News/News"
import { getCookie } from "js/getCookie"

let strings = new LocalizedStrings(locale)

class NewsPages extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            newsList: [],
            nextPageExists: false,
            prevPageExists: false,
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.number === prevProps.match.params.number) {
            return
        }
        this.getNextPage()
    }

    componentDidMount() {
        this.getNextPage()
    }

    async getNextPage() {
        this.setState({
            loading: true,
        })
        let pageNumber = 1
        if (this.props.match.params.number) {
            pageNumber = this.props.match.params.number
        }

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/newsdb/page/" + pageNumber, {
                credentials: "include",
                method: "GET",
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            //otherwise set state
            this.setState({
                prevPageExists: (pageNumber - 1 > 0) ? true : false,
                nextPageExists: (result[0] === "yes") ? true : false,
                showResult: true,
                isError: false,
                loading: false,
                newsList: result.slice(1),
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
        const pageNumber = this.props.match.params.number;

        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/"
                    header={strings.pageheaders.main}
                    descr={strings.pagedescriptions.main}
                />
                <Grid item xs={10} md={8}>
                    <GreyPaper elevation={4} >
                        <Grid container justify="center">

                            <Grid item xs={12}>
                                <IndexPageTitle />
                            </Grid>

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
                                    <Box py={3} px={2}>
                                        <NewsList>
                                            {this.state.newsList}
                                        </NewsList>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <NavigationBlock
                                        class="row m-0 px-4 py-2 "

                                        prevTitle={this.state.prevPageExists ? strings.buttons.nextpage : null}
                                        nextTitle={this.state.nextPageExists ? strings.buttons.prevpage : null}

                                        prev={this.state.prevPageExists ? `/news/page/${pageNumber ? Number(pageNumber) - 1 : 1}` : null}
                                        next={this.state.nextPageExists ? `/news/page/${pageNumber ? Number(pageNumber) + 1 : 1}` : null}
                                    />
                                </Grid>
                            </>}

                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        );
    }
}

export default NewsPages