import React from "react";
import Errors from "../PvP/components/Errors/Errors"
import BarLoader from "react-spinners/BarLoader";
import { Helmet } from "react-helmet";

import LocalizedStrings from 'react-localization';
import { locale } from "../../locale/locale";
import { getCookie } from "../../js/indexFunctions";

let strings = new LocalizedStrings(locale);


function parseNewsList(list) {
    let result = []

    for (var i = 0; i < list.length; i++) {
        var elementI = JSON.parse(list[i])

        result.push(
            <div key={i} className="singleNews">
                <div className="singleNewsTitle">
                    {elementI.Title + "  " + elementI.Date}
                </div>
                {<div className="singleNewsBody" dangerouslySetInnerHTML={{ __html: elementI.Description }} />}
            </div>
        )
    }
    return result
}

class News extends React.Component {
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
        var reason = ""
        let response = await fetch(((navigator.userAgent != "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/newsdb/id/" + this.props.match.params.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip',
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
            news: parseNewsList(result),
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
                            <div className="col-12 mt-0 mb-3 order-lg-2" style={{ fontWeight: "500", color: "white" }} >
                                <div className="row justify-content-center">
                                    <div>
                                        {strings.tips.loading}
                                        <BarLoader
                                            color={"white"}
                                            loading={this.state.loading}
                                        />
                                    </div>
                                </div>
                            </div>}
                        <div className="col-md-10 col-lg-8 p-0">
                            {this.state.showResult &&
                                <>
                                    {this.state.news && this.state.news}
                                </>}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default News