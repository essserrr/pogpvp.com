import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Button from "App/Components/Button/Button";
import DoubleSlider from "../../../Movedex/MoveCard/DoubleSlider/DoubleSlider";
import PvpWillow from "./PvpWillow/PvpWillow";
import AdvisorPages from "./AdvisorPages/AdvisorPages";

import { pvp } from "locale/Pvp/Pvp";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(pvp);

class Advisor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.advisor = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

        this.state = {
            n: 1,
            sortParam: "zeros",
        }

        this.focusDiv = this.focusDiv.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
        this.makeAdvice()
    };

    componentDidUpdate(prevProps) {
        if (prevProps.rawResult === this.props.rawResult) {
            return
        }
        this.focusDiv();
        this.makeAdvice()
    };

    makeAdvice() {
        this.setState({
            isNextPage: this.props.list.length > 50 ? true : false,
            n: 1,
        })
    }

    focusDiv() {
        this.advisor.current.focus();
    };

    loadMore() {
        this.setState({
            isNextPage: this.props.list.length > (this.state.n + 1) * 50 ? true : false,
            n: this.props.list.length > this.state.n * 50 ? this.state.n + 1 : this.state.n,
        })
    }


    onSortChange(event, attributes) {
        this.setState({
            sortParam: attributes.attr,
        })
    }

    render() {
        return (
            <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
                <Grid container justify="center" spacing={2}>

                    <Grid item xs={12} tabIndex="0" ref={this.advisor}>
                        <PvpWillow />
                    </Grid>

                    <Grid item xs={12}>
                        <DoubleSlider
                            onClick={this.onSortChange}
                            attrs={["zeros", "rating"]}
                            titles={[strings.buttons.byzeros, strings.buttons.byrating]}
                            active={[this.state.sortParam === "zeros", this.state.sortParam === "rating"]}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <AdvisorPages
                            n={this.state.n}

                            leftPanel={this.props.leftPanel}
                            rightPanel={this.props.rightPanel}

                            moveTable={this.props.moveTable}
                            pokemonTable={this.props.pokemonTable}

                            rawResult={this.props.rawResult}
                            filter={this.state.sortParam}
                        >
                            {this.props.list}
                        </AdvisorPages>
                    </Grid>

                    {this.state.isNextPage &&
                        <Grid item xs="auto">
                            <Button title={strings.buttons.loadmore} onClick={this.loadMore} />
                        </Grid>}

                </Grid>
            </GreyPaper>
        );
    }
};

export default Advisor;

Advisor.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    rawResult: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)),

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,

    leftPanel: PropTypes.object,
    rightPanel: PropTypes.object,
};