import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Input from "App/Components/Input/Input";
import MovedexListFilter from "./MovedexListFilter/MovedexListFilter";
import { getMoveBase } from "AppStore/Actions/getMoveBase";
import DropWithArrow from "../PvpRating/DropWithArrow/DropWithArrow";
import MoveDescr from "./MoveDescr/MoveDescr";
import DoubleSlider from "./MoveCard/DoubleSlider/DoubleSlider";
import TypeRow from "./TypeRow/TypeRow";

import { dexLocale } from "locale/Movedex/Movedex";
import { getCookie } from "js/getCookie";

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

            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
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

    onSortColumn(event, attributes) {
        const { coltype, name } = attributes

        this.setState({
            active: {
                field: name,
                type: coltype,
                order: name === this.state.active.field ? !this.state.active.order : true,
            },
        });
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/movedex"
                    header={strings.helm.mdtitle}
                    descr={strings.helm.mddescr}
                />
                <Grid item xs={12} md={10} lg={8} container justify="center" spacing={2} >


                    <Grid item xs={12}>
                        <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
                            <DropWithArrow title={strings.tip.title}>
                                <MoveDescr />
                            </DropWithArrow>
                        </GreyPaper>
                    </Grid>


                    <Grid item xs={12}>
                        <GreyPaper elevation={4} enablePadding>
                            <Grid container justify="center" spacing={2}>

                                {this.state.loading &&
                                    <Grid item xs={12}>
                                        <LinearProgress color="secondary" />
                                    </ Grid>}

                                {this.state.isError &&
                                    <Grid item xs={12}>
                                        <Alert variant="filled" severity="error">{this.state.error}</Alert >
                                    </ Grid>}




                                {this.state.showResult &&
                                    <>
                                        <Grid item xs={12}>
                                            <Input
                                                onChange={this.onNameChange}
                                                label={strings.moveplace}
                                                value={this.state.name}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <DoubleSlider
                                                onClick={this.onFilter}

                                                attr1="showCharge"
                                                title1={strings.chm}
                                                active1={Boolean(this.state.filter.showCharge)}

                                                attr2="showQuick"
                                                title2={strings.qm}
                                                active2={Boolean(this.state.filter.showQuick)}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TypeRow
                                                filter={this.state.filter}
                                                onFilter={this.onFilter}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <MovedexListFilter
                                                name={this.state.name}
                                                filter={this.state.filter}
                                                sort={this.state.active}
                                                onClick={this.onSortColumn}
                                            >
                                                {this.props.bases.moveBase}
                                            </MovedexListFilter>
                                        </Grid>

                                    </>}

                            </Grid>
                        </GreyPaper>
                    </Grid>



                </Grid>
            </Grid>
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