import React from "react"
import LocalizedStrings from "react-localization"

import Button from "App/Components/Button/Button";
import DoubleSlider from "../../../Movedex/MoveCard/DoubleSlider/DoubleSlider"
import Iconer from "App/Components/Iconer/Iconer";
import AdvisorPages from "./AdvisorPages/AdvisorPages"

import { pvp } from "../../../../locale/Pvp/Pvp"
import { getCookie } from "../../../../js/getCookie"

import "./Advisor.scss"

let strings = new LocalizedStrings(pvp);

class Advisor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.advisor = React.createRef();

        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

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
            <div className="advisor px-2 py-2 col-12 ">
                <div tabIndex="0" ref={this.advisor} className="col-12 d-flex justify-content-center p-0">

                    <Iconer fileName="willow3" folderName="/" />

                    <div className="advisor__willow--bubble-text px-2 py-1">
                        {strings.advisor.willow}
                    </div>
                </div>
                <div className="col-12 p-0 pb-2">
                    <DoubleSlider
                        onClick={this.onSortChange}
                        attrs={["zeros", "rating"]}
                        titles={[strings.buttons.byzeros, strings.buttons.byrating]}
                        active={[this.state.sortParam === "zeros", this.state.sortParam === "rating"]}
                    />
                </div>
                <div className="col-12 p-0 ">
                    <AdvisorPages
                        n={this.state.n}

                        leftPanel={this.props.leftPanel}
                        rightPanel={this.props.rightPanel}

                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        rawResult={this.props.rawResult}
                        filter={this.state.sortParam}
                        list={this.props.list}
                    />
                </div>
                {this.state.isNextPage &&
                    <div className="row justify-content-center m-0 mt-3">

                        <Button
                            title={strings.buttons.loadmore}
                            onClick={this.loadMore}
                        />

                    </div>}
            </div>
        );
    }
};

export default Advisor;
