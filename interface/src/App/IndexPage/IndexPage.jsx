import React from "react";
import LocalizedStrings from 'react-localization'
import SiteHelm from "../SiteHelm/SiteHelm"

import SubmitButton from "../PvP/components/SubmitButton/SubmitButton"
import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"


import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(locale);

function parseNewsList(list) {
    let result = []
    for (var i = 1; i < list.length; i++) {
        var elementI = JSON.parse(list[i])
        result.push(
            <a key={i} href={(navigator.userAgent === "ReactSnap") ? "/" :
                "/news/id/" + elementI.ID}>
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

    buttonsConfig() {
        if (this.state.prevPageExists && this.state.nextPageExists) {
            return "justify-content-between"
        }
        if (this.state.prevPageExists) {
            return "justify-content-start"
        }
        return "justify-content-end"
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/"
                    header={strings.pageheaders.main}
                    descr={strings.pagedescriptions.main}
                />
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="newsBody col-md-10 col-lg-8 p-0">
                            <div className="newsTitle mb-3 ">
                                {strings.title.latestnews}
                            </div>
                            {this.state.loading &&
                                <div className="col-12 mt-0 mb-3 order-lg-2" >
                                    <Loader
                                        color="black"
                                        weight="500"
                                        locale={strings.tips.loading}
                                        loading={this.state.loading}
                                    />
                                </div>}
                            {this.state.isError && <Errors class="alert alert-danger m-2 p-2" value={this.state.error} />}
                            {this.state.showResult && <>
                                {this.state.newsList && this.state.newsList}
                                <div className={"row m-0 p-0 px-3 " + this.buttonsConfig()} >
                                    {this.state.prevPageExists && <SubmitButton
                                        action="Previous Page"
                                        label={strings.buttons.prevpage}
                                        onSubmit={this.onSubmit}
                                        class="btn btn-primary btn-sm"
                                    />}

                                    {this.state.nextPageExists && <SubmitButton
                                        action="Next Page"
                                        label={strings.buttons.nextpage}
                                        onSubmit={this.onSubmit}
                                        class="btn btn-primary btn-sm"
                                    />}
                                </div>
                            </>}
                        </div>

                    </div>
                </div >
            </>
        );
    }
}

export default MainPage