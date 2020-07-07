import React from "react";
import Errors from "../PvP/components/Errors/Errors"
import { Helmet } from "react-helmet";


import LocalizedStrings from "react-localization";
import { locale } from "../../locale/locale";
import { getCookie } from "../../js/indexFunctions";
import Loader from "../PvpRating/Loader"
import News from "./News/News"

let strings = new LocalizedStrings(locale);


class NewsWrap extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

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
        let reason = ""
        let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/newsdb/id/" + this.props.match.params.id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept-Encoding": "gzip",
            },
        }).catch(function (r) {
            reason = r
            return
        });

        if (reason !== "") {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(reason)
            });
            return
        }

        let result = await response.json()
        if (!response.ok) {
            this.setState({
                error: result.detail,
                showResult: false,
                isError: true,
                loading: false,
            });
            return;
        }

        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            news: JSON.parse(result[0]),
        });

    }


    render() {
        return (
            <>
                <Helmet>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <div className=" container-fluid mt-3 ">
                    <div className=" row justify-content-center px-2 mb-5">
                        {this.state.loading &&
                            <div className="col-12 mt-0 mb-3 order-lg-2">
                                <Loader
                                    color="white"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />
                            </div>}
                        <div className="col-md-10 col-lg-8 p-0">
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult &&
                                <>
                                    {this.state.news &&
                                        <News
                                            class="singleNews"
                                            title={this.state.news.Title}
                                            date={this.state.news.Date}
                                            description={this.state.news.Description}
                                        />}
                                </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default NewsWrap