import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";
import { connect } from "react-redux"

import LazyTable from "../Pokedex/LazyTable/LazyTable"
import { getMoveBase } from "../../AppStore/Actions/getMoveBase"
import Errors from "../PvP/components/Errors/Errors"
import MoveRow from "./MoveRow/MoveRow"
import TableThead from "./TableThead/TableThead"
import Loader from "../PvpRating/Loader"
import DropWithArrow from "../PvpRating/DropWithArrow/DropWithArrow"
import MoveDescr from "./MoveDescr/MoveDescr"
import DoubleSlider from "./DoubleSlider/DoubleSlider"
import TypeRow from "./TypeRow/TypeRow"
import Input from "../PvP/components/Input/Input"

import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/getCookie"


let strings = new LocalizedStrings(dexLocale);

class Movedex extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            name: "",
            active: {},
            filter: {},


            showLegend: false,
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onShowLegend = this.onShowLegend.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.onSortColumn = this.onSortColumn.bind(this)
        this.onFilter = this.onFilter.bind(this)
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })

        try {
            let fetches = [
                this.props.getMoveBase(),
            ];

            let responses = await Promise.all(fetches)

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw this.props.bases.error }
            }

            let arr = []
            for (const [key, value] of Object.entries(this.props.bases.moveBase)) {
                arr.push(<MoveRow
                    key={key}
                    value={value}
                />)
            }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                moveTable: this.props.bases.moveBase,
                originalList: arr,
                listToShow: arr,
            });
        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e)
            })
        }
    }



    onNameChange(event) {
        if (this.state.blockSort) {
            return
        }
        let newList = this.state.originalList.filter(e => {
            return (e.key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) && this.filterArr(e, this.state.filter)
        })
        if (this.state.active.field) {
            newList = this.state.active.type === "number" ?
                this.sortNumber(this.state.active.field, newList) : this.sortString(this.state.active.field, newList)
        }
        this.setState({
            name: !event.target.value ? "" : event.target.value,
            listToShow: newList,
        });
    }

    onFilter(event) {
        if (this.state.blockSort) {
            return
        }
        let attr = event.currentTarget.getAttribute("attr")
        let newFilter = { ...this.state.filter, [attr]: !this.state.filter[attr] }
        let newList = this.state.originalList.filter(e => {
            return (e.key.toLowerCase().indexOf(this.state.name.toLowerCase()) > -1) &&
                this.filterArr(e, newFilter)
        })
        if (this.state.active.field) {
            newList = this.state.active.type === "number" ?
                this.sortNumber(this.state.active.field, newList) : this.sortString(this.state.active.field, newList)
        }
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: !this.state.filter[attr],
            },
            listToShow: newList,
        });
    }

    filterArr(e, filter) {
        let corresponds = true
        if (filter.showCharge || filter.showQuick) {
            switch (e.props.value.MoveCategory) {
                case "Charge Move":
                    corresponds *= filter.showCharge
                    break
                default:
                    corresponds *= filter.showQuick
            }
        }
        if (filter.type0 || filter.type1 || filter.type2 || filter.type3 || filter.type4 || filter.type5 ||
            filter.type6 || filter.type7 || filter.type8 || filter.type9 || filter.type10 || filter.type11 ||
            filter.type12 || filter.type13 || filter.type14 || filter.type15 || filter.type16 || filter.type17) {
            if (!filter["type" + e.props.value.MoveType]) {
                corresponds *= false
            }
        }
        return corresponds
    }


    onShowLegend() {
        this.setState({
            showLegend: !this.state.showLegend
        })
    }

    onSortColumn(event) {
        if (this.state.blockSort) {
            return
        }
        let fieldName = event.currentTarget.getAttribute("name")
        let fieldType = event.currentTarget.getAttribute("coltype")
        switch (this.state.active.field === fieldName) {
            case true:
                this.setState({
                    active: {
                        field: "",
                        type: "",
                    },
                    shinyRates: this.state.listToShow.reverse(),
                });
                break
            default:
                this.setState({
                    active: {
                        field: fieldName,
                        type: fieldType,
                    },
                    listToShow: fieldType === "number" ?
                        this.sortNumber(fieldName, this.state.listToShow) : this.sortString(fieldName, this.state.listToShow),
                });
                break
        }
    }

    sortNumber(fieldName, arr) {
        return arr.sort(function (a, b) {
            return b.props.value[fieldName] - a.props.value[fieldName]
        })
    }

    sortString(fieldName, arr) {
        return arr.sort(function (a, b) {
            if (a.props.value[fieldName] > b.props.value[fieldName]) {
                return -1;
            }
            if (b.props.value[fieldName] > a.props.value[fieldName]) {
                return 1;
            }
            return 0;
        })
    }


    render() {
        console.log(this.state.listToShow)
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/movedex"
                    header={strings.helm.mdtitle}
                    descr={strings.helm.mddescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews max1200-1 col-12 col-md-10 col-lg-8 p-1 p-sm-2 mb-3">
                            <DropWithArrow
                                onShow={this.onShowLegend}
                                show={this.state.showLegend}
                                title={strings.tip.title}
                                elem={<MoveDescr />}

                                faOpened="align-self-center fas fa-angle-up fa-lg "
                                faClosed="align-self-center fas fa-angle-down fa-lg"
                                outClass="row justify-content-between m-0 clickable"
                                inClass="row justify-content-start m-0" />
                        </div>
                    </div>
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews max1200-1 col-12  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                            {this.state.showResult &&
                                <>
                                    <Input
                                        class="modifiedBorder form-control"
                                        onChange={this.onNameChange}
                                        place={strings.moveplace}
                                        value={this.state.name}
                                    />
                                    <DoubleSlider
                                        onClick={this.onFilter}

                                        attr1="showCharge"
                                        title1={strings.chm}
                                        active1={this.state.filter.showCharge}

                                        attr2="showQuick"
                                        title2={strings.qm}
                                        active2={this.state.filter.showQuick}
                                    />
                                    <TypeRow
                                        filter={this.state.filter}
                                        onFilter={this.onFilter}
                                    />
                                    <LazyTable
                                        list={this.state.listToShow}
                                        thead={<>
                                            <TableThead
                                                active={this.state.active}
                                                onClick={this.onSortColumn}
                                            />
                                        </>}
                                        activeFilter={this.state.active}
                                        pageSize={40}
                                    />
                                </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getMoveBase: () => dispatch(getMoveBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(Movedex)