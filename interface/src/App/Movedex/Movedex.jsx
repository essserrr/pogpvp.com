import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import MovedexListFilter from "./MovedexListFilter/MovedexListFilter"
import { getMoveBase } from "../../AppStore/Actions/getMoveBase"
import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import DropWithArrow from "../PvpRating/DropWithArrow/DropWithArrow"
import MoveDescr from "./MoveDescr/MoveDescr"
import DoubleSlider from "./MoveCard/DoubleSlider/DoubleSlider"
import TypeRow from "./TypeRow/TypeRow"
import Input from "../PvP/components/Input/Input"

import { dexLocale } from "../../locale/dexLocale"
import { getCookie } from "../../js/getCookie"

import "./Movedex.scss"

let strings = new LocalizedStrings(dexLocale);

class Movedex extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            name: "",
            active: {
            },
            filter: {
            },

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
                if (!responses[i].ok) { throw responses[i].detail }
            }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,
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
        this.setState({
            name: !event.target.value ? "" : event.target.value,
        });
    }

    onFilter(event) {
        let attr = event.currentTarget.getAttribute("attr")
        this.setState({
            filter: {
                ...this.state.filter,
                [attr]: !this.state.filter[attr],
            },
        });
    }

    onShowLegend() {
        this.setState({
            showLegend: !this.state.showLegend
        })
    }

    onSortColumn(event) {
        let fieldName = event.currentTarget.getAttribute("name")
        let fieldType = event.currentTarget.getAttribute("coltype")

        this.setState({
            active: {
                field: fieldName,
                type: fieldType,
                order: fieldName === this.state.active.field ? !this.state.active.order : true,
            },
        });
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/movedex"
                    header={strings.helm.mdtitle}
                    descr={strings.helm.mddescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className="row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="movedex__descr col-12 col-md-10 col-lg-8 p-1 p-sm-2 mb-3">
                            <DropWithArrow
                                onShow={this.onShowLegend}
                                show={this.state.showLegend}
                                title={strings.tip.title}
                                elem={<MoveDescr />}

                                faOpened="align-self-center fas fa-angle-up fa-lg "
                                faClosed="align-self-center fas fa-angle-down fa-lg"
                                outClass="clickable row justify-content-between m-0"
                                inClass="row justify-content-start m-0" />
                        </div>
                    </div>
                    <div className="row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="movedex__module col-12 col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
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
                                    <MovedexListFilter
                                        name={this.state.name}
                                        list={this.props.bases.moveBase}
                                        filter={this.state.filter}
                                        sort={this.state.active}
                                        onClick={this.onSortColumn}
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