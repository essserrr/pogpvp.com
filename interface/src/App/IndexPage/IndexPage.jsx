import React from "react";
import LocalizedStrings from 'react-localization'
import BarLoader from "react-spinners/BarLoader"
import { Helmet } from 'react-helmet'

import SubmitButton from "../PvP/components/SubmitButton/SubmitButton"
import Errors from "../PvP/components/Errors/Errors"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(locale);

function parseNewsList(list) {
    let result = []
    for (var i = 1; i < list.length; i++) {
        var elementI = JSON.parse(list[i])
        result.push(
            <a key={i} href={"/news/id/" + elementI.ID}>
                <div className="singleNews hoverable">
                    <div className="singleNewsTitle">
                        {elementI.Title + "  " + elementI.Date}
                    </div>
                    {<div className="singleNewsBody" dangerouslySetInnerHTML={{ __html: elementI.ShortDescription }} />}
                </div>
            </a>
        )
    }
    return result
}

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            nextPageExists: false,
            prevPageExists: false,
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        var reason = ""
        var pageNumber = 1
        if (this.props.match.params.number) {
            pageNumber = this.props.match.params.number
        }
        let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/newsdb/page/" + pageNumber, {
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
            prevPageExists: (pageNumber - 1 > 0) ? true : false,
            nextPageExists: (result[0] === "yes") ? true : false,
            showResult: true,
            isError: false,
            loading: false,
            newsList: parseNewsList(result),
        });

    }

    onSubmit(event) {
        event.preventDefault();
        var pageNumber = 1
        if (this.props.match.params.number) {
            pageNumber = Number(this.props.match.params.number)
        }
        var delta
        switch (event.target.attributes["action"].value) {
            case "Previous Page":
                delta = -1
                break
            default:
                delta = 1
                break
        }
        var nextPage = pageNumber + delta
        if (nextPage <= 0) {
            return
        }
        window.location = ("/news/page/" + nextPage);
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>{strings.pageheaders.main}</title>
                    <meta name="title" content={strings.pageheaders.main} />
                    <meta name="description" content={strings.pagedescriptions.main} />

                    <meta property="og:title" content={strings.pageheaders.main} />
                    <meta property="og:description" content={strings.pagedescriptions.main} />

                    <meta property="twitter:title" content={strings.pageheaders.main} />
                    <meta property="twitter:description" content={strings.pagedescriptions.main} />
                </Helmet>
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="newsBody col-md-10 col-lg-8 p-0">
                            <div className="newsTitle mb-3 ">
                                {strings.title.latestnews}
                            </div>
                            {this.state.loading &&
                                <div className="col-12 mt-0 mb-3 order-lg-2" style={{ fontWeight: "500", color: "black" }} >
                                    <div className="row justify-content-center">
                                        <div>
                                            {strings.tips.loading}
                                            <BarLoader
                                                color={"black"}
                                                loading={this.state.loading}
                                            />
                                        </div>
                                    </div>
                                </div>}
                            {this.state.showResult && <>
                                {this.state.newsList && this.state.newsList}
                                <div className="row m-0 p-0">
                                    <div className="col m-0 p-0 d-flex justify-content-start">
                                        {this.state.prevPageExists && <SubmitButton
                                            action="Previous Page"
                                            label={strings.buttons.prevpage}
                                            onSubmit={this.onSubmit}
                                            class="newsButton btn btn-primary btn-sm"
                                        />}
                                    </div>
                                    <div className="col m-0 p-0 d-flex justify-content-end">
                                        {this.state.nextPageExists && <SubmitButton
                                            action="Next Page"
                                            label={strings.buttons.nextpage}
                                            onSubmit={this.onSubmit}
                                            class="newsButton btn btn-primary btn-sm"
                                        />}
                                    </div>
                                </div>
                            </>}
                            {this.state.isError && <Errors class="alert alert-danger m-2 p-2" value={this.state.error} />}
                        </div>

                    </div>
                </div >
            </>
        );
    }
}

export default MainPage