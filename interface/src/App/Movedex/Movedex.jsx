import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';
import CSSTransitionGroup from 'react-addons-css-transition-group'


import Errors from "../PvP/components/Errors/Errors"
import MoveRow from "./MoveRow/MoveRow"
import TableThead from "./TableThead/TableThead"
import Loader from "../PvpRating/Loader"
import DropWithArrow from "../PvpRating/DropWithArrow/DropWithArrow"
import MoveDescr from "./MoveDescr/MoveDescr"

import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(dexLocale);

class Movedex extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showLegend: false,
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onShowLegend = this.onShowLegend.bind(this)
        this.onChange = this.onChange.bind(this)
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
            originalList: arr,
            listToShow: arr,
        });
    }


    onChange(event) {
        var newArray = []
        for (var i = 0; i < this.state.originalList.length; i++) {
            if (this.state.originalList[i].key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                newArray.push(this.state.originalList[i])
            }
        }

        this.setState({
            name: event.value,
            listToShow: newArray,
        });
    }


    onShowLegend() {
        this.setState({
            showLegend: !this.state.showLegend
        })
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/movedex"
                    header={strings.mdtitle}
                    descr={strings.mddescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews col-12  col-md-10 col-lg-8 p-1 p-sm-2">
                            <DropWithArrow
                                onShow={this.onShowLegend}
                                show={this.state.showLegend}
                                title={strings.tip.title}
                                elem={<MoveDescr />}

                                faOpened="align-self-center fas fa-angle-up fa-lg "
                                faClosed="align-self-center fas fa-angle-down fa-lg"
                                outClass="row justify-content-between m-0 p-0 clickable"
                                inClass="row justify-content-start m-0 p-0" />
                        </div>

                        <div className="singleNews col-12  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult &&
                                <>
                                    <input onChange={this.onChange} className="form-control" type="text" placeholder={strings.moveplace} />
                                    <table className="table mb-0 table-sm text-center">
                                        <TableThead
                                        />
                                        <CSSTransitionGroup
                                            component="tbody"
                                            transitionName="shiny"
                                            transitionEnterTimeout={150}
                                            transitionLeaveTimeout={150}
                                        >
                                            {this.state.listToShow}
                                        </CSSTransitionGroup>
                                    </table>
                                </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default Movedex

