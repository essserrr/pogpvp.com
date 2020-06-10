import React from "react";
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip";
import { UnmountClosed } from 'react-collapse';

import PokemonIconer from "../PokemonIconer/PokemonIconer"
import Result from "../Result"

import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";
import { locale } from "../../../..//locale/locale"
import { getCookie, returnRateStyle } from "../../..//../js/indexFunctions"


let strings = new LocalizedStrings(locale);



class AdvisorPanel extends React.PureComponent {

    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showCollapse: false,
            colElement: null,
        };
        this.onClick = this.onClick.bind(this);

    }
    onClick(event) {
        this.setState({
            showCollapse: !this.state.showCollapse,
            colElement: !this.state.showCollapse ? this.generateBody() : null,
        })

    }

    generateBody() {
        return <div className="col-12 m-0 p-0 px-2" key={"coll" + this.props.i}>
            <div className="row m-0 p-0 mx-1 my-2  justify-content-center">
                <div className="col-12 text-center bigText m-0 p-0">
                    Bad matchups
                </div>
                {this.makeZerosList()}
            </div>

            <div className="col-12 text-center bigText m-0 p-0 mt-1 mb-2">
                All matchups
            </div>
            <div className="overflowingx width90vw p-0 m-0">
                <Result
                    class="tableFixHead"
                    table={this.makeTableBody(this.recombineTable())}
                />
            </div>


        </div>
    }


    makeZerosList() {
        //bad matchups
        let zerosList = []
        for (let z = 0; z < this.props.list[this.props.i].zeros.length; z++) {
            let pok = this.props.rightPanel.listForBattle[this.props.list[this.props.i].zeros[z]]
            zerosList.push(
                <div className="posRel">
                    {(pok.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                    <PokemonIconer
                        src={this.props.pokemonTable[pok.name].Number + (this.props.pokemonTable[pok.name].Forme !== "" ? "-" + this.props.pokemonTable[pok.name].Forme : "")}
                        class={"icon48 mr-2"}
                        for={pok.name + z + "zero"}
                    />

                    <ReactTooltip
                        className={"infoTip"}
                        id={pok.name + z + "zero"} effect='solid'
                        place={"top"}
                        multiline={true}
                    >
                        {pok.name + (pok.IsShadow === "true" ? " (" + strings.options.type.shadow + ")" : "")}
                    </ReactTooltip>
                </div>
            )
        }
        return zerosList.length > 0 ? zerosList : "None"
    }



    makeTableBody(arr) {
        var tableBody = []
        //create table body
        tableBody.push(
            <thead key={"thead0"} className="thead thead-light" >
                <tr >
                    {arr[0]}
                </tr>
            </thead>
        )
        var arrWithTr = []
        for (let i = 1; i < arr.length; i++) {
            arrWithTr.push(
                <tr key={"tableline" + i}>
                    {arr[i]}
                </tr>
            )
        }
        tableBody.push(
            <tbody key={"tablebody"} className="modifiedBorderTable">
                {arrWithTr}
            </tbody>
        )
        return tableBody
    }



    recombineTable() {
        var arr = []
        //markup table
        arr.push(this.props.rawResult[0])
        arr.push(this.props.rawResult[this.props.list[this.props.i].first + 1])
        arr.push(this.props.rawResult[this.props.list[this.props.i].second + 1])
        arr.push(this.props.rawResult[this.props.list[this.props.i].third + 1])
        return arr
    }





    render() {
        return (
            <div className={"cardBig row m-0 p-0 py-1 justify-content-between"}>
                <div className={"row m-0 p-0"}>
                    <div className="ml-2 mr-2 bigText align-self-center ">{"#" + (this.props.i + 1)}</div>
                    <div className="posRel">
                        {(this.props.first.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.first.name].Number + (this.props.pokemonTable[this.props.first.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.first.name].Forme : "")}
                            class={"icon48 ml-2 ml-sm-3 mr-2"} />
                    </div>

                    <div className="posRel">
                        {(this.props.second.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.second.name].Number + (this.props.pokemonTable[this.props.second.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.second.name].Forme : "")}
                            class={"icon48 ml-2 ml-sm-3 mr-2"} />
                    </div>

                    <div className="posRel">
                        {(this.props.third.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                        <PokemonIconer
                            src={this.props.pokemonTable[this.props.third.name].Number + (this.props.pokemonTable[this.props.third.name].Forme !== "" ? "-" + this.props.pokemonTable[this.props.third.name].Forme : "")}
                            class={"icon48 ml-2 ml-sm-3 mr-2"} />
                    </div>
                </div>
                <div className={"row m-0 p-0"}>
                    <div className="mr-2 mr-sm-4 w64 bigText text-center align-self-center ">{this.props.list[this.props.i].zeros.length}</div>
                    <div className="mr-2 mr-sm-4 w64 bigText text-center align-self-center ">{(this.props.list[this.props.i].rate / 3).toFixed(1)}</div>
                    <div onClick={this.onClick} className="clickable align-self-center m-0 p-0  px-3">
                        <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg " : "fas fa-angle-down fa-lg"}></i>
                    </div>
                </div>

                <div className={"col-12 m-0 p-0"}>
                    <UnmountClosed isOpened={this.state.showCollapse}>

                        {this.state.colElement}

                    </UnmountClosed>

                </div>

            </div>

        );
    }
};

export default AdvisorPanel;
