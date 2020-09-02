import React from "react"
import LocalizedStrings from "react-localization"
import InfiniteScroll from 'react-infinite-scroll-component'


import UserPokCard from "./UserPokCard/UserPokCard"

import { getCookie } from "../../../../../js/getCookie"
import { userLocale } from "../../../../../locale/userLocale"

import "./UserPokemonList.scss"

let strings = new LocalizedStrings(userLocale)

class UserShinyList extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            theWholeList: this.props.list,

            page: 0,
            listToShow: this.props.list.slice(0, 20 > this.props.list.length ? this.props.list.length : 20),
            isNext: 20 > this.props.list.length ? false : true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.list === prevProps.list) {
            return
        }

        this.setState({
            theWholeList: this.props.list,
            listToShow: this.props.list.slice(0, 20 > this.props.list.length ? this.props.list.length : 20),
            page: 0,
            isNext: 20 > this.props.list.length ? false : true
        })
    }


    fetchMoreData = () => {
        let page = (this.state.page + 1) * 20 > this.props.list.length ? this.state.page : (this.state.page + 1)
        let upperBound = (this.state.page + 1) * 20 > this.props.list.length ? this.props.list.length : (this.state.page + 1) * 20

        console.log(this.state.page !== page)
        console.log(this.props.list.slice(this.state.page * 20, upperBound))
        this.setState({
            listToShow: this.state.listToShow.concat(this.props.list.slice(this.state.page * 20, upperBound)),
            page: page,
            isNext: this.state.page !== page
        })
    };


    render() {
        return (
            <div id="scrollableDiv" className="ushiny row mx-0  p-2 justify-content-start">
                <InfiniteScroll
                    dataLength={this.state.listToShow.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.isNext}
                    scrollableTarget="scrollableDiv"
                    scrollThreshold={0.7}
                >
                    <div className="row mx-0">
                        {this.state.listToShow.map((value, index) =>
                            <UserPokCard
                                key={index}
                                index={index}

                                attr={this.props.attr}
                                value={value}

                                moveTable={this.props.moveTable}
                                pokemonTable={this.props.pokemonTable}

                                onClick={this.props.onPokemonDelete}
                                onPokemonEdit={this.props.onPokemonEdit}
                            />)}
                    </div>



                </InfiniteScroll>
            </div>
        );
    }
}

export default UserShinyList
