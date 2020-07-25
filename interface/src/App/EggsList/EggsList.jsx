import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";

import Errors from "../PvP/components/Errors/Errors"
import EggsTier from "./EggsTier/EggsTier"
import EggsIcon from "./EggsIcon/EggsIcon"
import ButtonsBlock from "./ButtonsBlock/ButtonsBlock"
import Button from "../Movedex/Button/Button"
import Loader from "../PvpRating/Loader"

import { getCookie } from "../../js/getCookie"
import { locale } from "../../locale/locale"


let strings = new LocalizedStrings(locale);

class EggsList extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showResult: false,
            isError: false,
            error: "",
            loading: false,

            filter: {
                showReg: false,
            },
        };
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        //get pok and eggs db
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/eggs", {
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
        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            listToShow: this.returnEggsList(results[1], results[0], this.state.filter),
            tierList: results[1],
            pokTable: results[0],
        });
    }

    returnEggsList(tierList, pokTable, filter) {
        let matrix = ["10KM Eggs", "7KM Gift Eggs", "5KM Eggs", "2KM Eggs", "10KM Eggs (50KM)", "5KM Eggs (25KM)",]
        return matrix.map((block, i) => <EggsTier
            key={"eggs" + i}
            class="separator capsSeparator"
            title={<EggsIcon tier={block} />}
            list={tierList[block]}
            pokTable={pokTable}
            showReg={filter.showReg}
        />);
    }

    onChange(event) {
        let attr = event.target.getAttribute("attr")
        let newFilter = { ...this.state.filter, [attr]: !this.state.filter[attr] }
        let list = this.returnEggsList(this.state.tierList, this.state.pokTable, newFilter)
        this.setState({
            listToShow: list.filter(elem => this.filter(elem, newFilter)),
            filter: {
                ...this.state.filter,
                [attr]: !Boolean(this.state.filter[attr])
            }
        })
    }

    filter(elem, filter) {
        if (!filter) {
            return true
        }
        if (!filter.eggs0 && !filter.eggs1 && !filter.eggs2 && !filter.eggs3 && !filter.eggs4 && !filter.eggs5) {
            return true
        }
        return filter[elem.key]
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/eggs"
                    header={strings.pageheaders.eggs}
                    descr={strings.pagedescriptions.eggs}
                />
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews max1200-1 col-sm-12 col-md-11 col-lg-8 mx-0 py-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.listToShow &&
                                <>
                                    <ButtonsBlock
                                        filter={this.state.filter}
                                        onFilter={this.onChange}
                                    />
                                    <div className=" row justify-content-center m-0">
                                        <div className={"col-12 col-sm-6 p-0 mb-3 text-center sliderGroup justify-content-center"} >
                                            <Button
                                                attr="showReg"
                                                title={strings.tierlist.regionals}
                                                class={this.state.filter.showReg ?
                                                    "col py-1 sliderButton active" : "col py-1 sliderButton"}
                                                onClick={this.onChange}
                                            />
                                        </div>
                                    </div>
                                </>}
                            {this.state.isError && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                            {this.state.listToShow && this.state.listToShow}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default EggsList









