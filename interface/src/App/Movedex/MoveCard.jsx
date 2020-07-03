import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';


import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import CardTitle from "./CardTitle/CardTitle"
import ChargeMove from "./CardBody/ChargeMove"
import QuickMove from "./CardBody/QuickMove"
import EffTable from "../Pokedex/EffBlock/EffTable"
import CollBlock from "../Pokedex/CollBlock/CollBlock"


import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(dexLocale);

class MoveCard extends React.Component {
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

        //if error imput somehow
        if (!results[0][this.props.match.params.id]) {
            this.setState({
                error: strings.moveerr,
                showResult: false,
                loading: false,
                isError: true,
            });
            return
        }

        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            moveTable: results[0],
            move: results[0][this.props.match.params.id],
        });
    }

    render() {
        return (
            <>
                <SiteHelm
                    url={"https://pogpvp.com/movedex/" + encodeURIComponent(this.props.match.params.id)}
                    header={this.props.match.params.id + strings.mdsdescr + " | PogPvP.com"}
                    descr={this.props.match.params.id + strings.mdsdescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews col-12  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult && this.state.move && <>
                                <CardTitle move={this.state.move} />
                                <div className="row m-0 p-0">
                                    {this.state.move.MoveCategory === "Charge Move" ?
                                        <ChargeMove move={this.state.move} /> :
                                        <QuickMove move={this.state.move} />}
                                </div>
                                <CollBlock
                                    locale={strings.moveeff}
                                    defOpen={false}
                                    elem={
                                        <EffTable
                                            type={[this.state.move.MoveType]}
                                            reverse={true}
                                        />} />
                            </>
                            }
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default MoveCard
