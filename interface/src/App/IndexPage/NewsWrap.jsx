import React from "react";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import News from "./News/News";

class NewsWrap extends React.Component {
    constructor() {
        super();
        this.state = {
            showResult: true,
            isError: false,
            error: "",
            loading: false,
        };
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/newsdb/id/" + this.props.match.params.id, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            //otherwise set state
            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                news: JSON.parse(result[0]),
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

                {this.state.loading &&
                    <Grid item xs={12}>
                        <LinearProgress color="secondary" />
                    </ Grid>}

                <Grid item xs={10} md={8}>
                    {this.state.isError &&
                        <Alert variant="filled" severity="error">{this.state.error}</Alert >
                    }
                    {this.state.showResult && this.state.news &&
                        <News
                            title={this.state.news.Title}
                            date={this.state.news.Date}
                            description={this.state.news.Description}
                        />}
                </Grid>
            </Grid >
        );
    }
}

export default NewsWrap;