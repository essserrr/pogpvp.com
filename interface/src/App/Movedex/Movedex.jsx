import React from "react";
import { Helmet } from "react-helmet";
import LocalizedStrings from 'react-localization';

import Errors from "../PvP/components/Errors/Errors"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import MoveRow from "./MoveRow/MoveRow"
import Header from "./Header/Header"
import Loader from "../PvpRating/Loader"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(locale);

class Movedex extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
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
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/moves", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
        ];
        var responses = await Promise.all(fetches).catch(function (r) {
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

        let parses = [
            responses[0].json(),
        ]
        var results = await Promise.all(parses)

        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                this.setState({
                    error: results[i].detail,
                    showResult: false,
                    loading: false,
                    isError: true,
                });
                return;
            }
        }

        let arr = []
        for (const [key, value] of Object.entries(results[0])) {
            arr.push(<MoveRow
                key={key}
                value={value}
            />)
        }


        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            moveTable: results[0],
            listToShow: arr,
        });
    }




    render() {
        return (
            <>
                <Helmet>
                    <link rel="canonical" href="https://pogpvp.com/movedex" />

                    <title>{strings.pageheaders.movedex}</title>
                    <meta name="description" content={strings.pagedescriptions.movedex} />

                    <meta property="og:title" content={strings.pageheaders.movedex} />
                    <meta property="og:url" content="https://pogpvp.com/movedex"></meta>
                    <meta property="og:description" content={strings.pagedescriptions.movedex} />

                    <meta property="twitter:title" content={strings.pageheaders.movedex} />
                    <meta property="twitter:url" content="https://pogpvp.com/movedex"></meta>
                    <meta property="twitter:description" content={strings.pagedescriptions.movedex} />
                </Helmet>
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult && <table className="table  table-sm text-center">
                                <thead>
                                    <tr>
                                        <th coltype="string" className="text-left  clickable align-text-top mx-0 mx-sm-2" name="0" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="1" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                classOut="row m-0 p-0 justify-content-center"
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="2" id="estimated" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                classOut="row m-0 p-0 justify-content-center"
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="3" id="estimated" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                classOut="row m-0 p-0 justify-content-center"
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="4" id="estimated" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                classOut="row m-0 p-0 justify-content-center"
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="5" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                classOut="row m-0 p-0 justify-content-center"
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="6" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                classOut="row m-0 p-0 justify-content-center"
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="number" className="clickable align-text-top mx-0 mx-sm-2" name="7" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                classOut="row m-0 p-0 justify-content-center"
                                                checked={false}
                                            />
                                        </th>
                                        <th coltype="string" className="clickable align-text-top mx-0 mx-sm-2" name="8" scope="col">
                                            <Header
                                                title="Name"
                                                class="ml-2 align-self-center "
                                                checked={false}
                                            />
                                        </th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {this.state.listToShow}
                                </tbody>
                            </table>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default Movedex

