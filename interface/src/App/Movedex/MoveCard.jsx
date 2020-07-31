import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";
import { UnmountClosed } from "react-collapse";


import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import CardTitle from "./CardTitle/CardTitle"
import ChargeMove from "./CardBody/ChargeMove"
import QuickMove from "./CardBody/QuickMove"
import EffTable from "../Pokedex/EffBlock/EffTable"
import UsesList from "./UsesList/UsesList"
import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/getCookie"
import DoubleSlider from "./DoubleSlider/DoubleSlider"


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

            active: {},
        };
        this.onClick = this.onClick.bind(this)
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/moves", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            }),
        ];
        let reason = ""
        let responses = await Promise.all(fetches).catch(function (r) {
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
            responses[1].json(),
        ]
        let results = await Promise.all(parses)

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

            pokTable: results[1],
            moveTable: results[0],
            move: results[0][this.props.match.params.id],
        });
    }

    onClick(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            active: {
                [attr]: !this.state.active[attr],
            },
        })
    }

    render() {
        return (
            <>
                <SiteHelm
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
                            {this.state.isError && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                            {this.state.showResult && this.state.move && <>
                                <CardTitle move={this.state.move} />
                                <div className="row m-0 p-0">
                                    {this.state.move.MoveCategory === "Charge Move" ?
                                        <ChargeMove move={this.state.move} /> :
                                        <QuickMove move={this.state.move} />}
                                </div>

                                <DoubleSlider
                                    onClick={this.onClick}

                                    attr1="eff"
                                    title1={strings.vunlist}
                                    active1={this.state.active.eff}

                                    attr2="use"
                                    title2={strings.used}
                                    active2={this.state.active.use}
                                />
                                <UnmountClosed isOpened={this.state.active.eff}>
                                    <div className={"row m-0"}>
                                        <EffTable
                                            type={[this.state.move.MoveType]}
                                            reverse={true}
                                        />
                                    </div>
                                </UnmountClosed>
                                <UnmountClosed isOpened={this.state.active.use}>
                                    <UsesList
                                        move={this.state.move}
                                        pokTable={this.state.pokTable}
                                    />
                                </UnmountClosed>
                            </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default MoveCard
