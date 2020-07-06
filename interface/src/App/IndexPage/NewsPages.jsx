import React from "react";
import LocalizedStrings from 'react-localization'
import SiteHelm from "../SiteHelm/SiteHelm"

import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import NavigationBlock from "../Pokedex/NavigationBlock/NavigationBlock"
import News from "./News"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(locale);

class NewsPages extends React.Component {
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
        let reason = ""
        let pageNumber = 1
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
            newsList: this.parseNewsList(result.slice(1)),
        });
    }


    parseNewsList(list) {
        return list.map((el, i) => {
            let parsed = JSON.parse(el)
            return <a key={i} href={(navigator.userAgent === "ReactSnap") ? "/" :
                "/news/id/" + parsed.ID}>
                <News
                    class="singleNews hoverable"
                    title={parsed.Title}
                    date={parsed.Date}
                    description={parsed.ShortDescription}
                />
            </a>
        })
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
                                <NavigationBlock
                                    class="row m-0 px-4 pb-2 "

                                    prevTitle={this.state.prevPageExists ?
                                        strings.buttons.nextpage : null}
                                    nextTitle={this.state.nextPageExists ?
                                        strings.buttons.prevpage : null}
                                    prev={this.state.prevPageExists ?
                                        "/news/page/" + (Number(this.props.match.params.number ? this.props.match.params.number : 1)
                                            - 1) : null}
                                    next={this.state.nextPageExists ?
                                        "/news/page/" + (Number(this.props.match.params.number ? this.props.match.params.number : 1)
                                            + 1) : null}
                                />
                            </>}
                        </div>

                    </div>
                </div >
            </>
        );
    }
}

export default NewsPages