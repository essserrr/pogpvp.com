import React from "react"
import InfiniteScroll from 'react-infinite-scroll-component'
import LocalizedStrings from "react-localization"

import UserShinyCard from "./UserShinyCard/UserShinyCard"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

import "./UserShinyList.scss"

let strings = new LocalizedStrings(userLocale)

class UserShinyList extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            page: 1,
            infiniteList: props.list.slice(0, props.elementsOnPage > props.list.length ? props.list.length : props.elementsOnPage),
            isNext: props.elementsOnPage > props.list.length ? false : true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.list === prevProps.list) {
            return
        }

        this.setState({
            infiniteList: this.props.list.slice(0, this.props.elementsOnPage > this.props.list.length ? this.props.list.length : this.props.elementsOnPage),
            page: 1,
            isNext: this.props.elementsOnPage > this.props.list.length ? false : true
        })
    }


    fetchMoreData = () => {
        let page = (this.state.page + 1) * this.props.elementsOnPage > this.props.list.length ? this.state.page : (this.state.page + 1)
        let upperBound = (this.state.page + 1) * this.props.elementsOnPage > this.props.list.length ? this.props.list.length : (this.state.page + 1) * this.props.elementsOnPage
        let isNext = (this.state.page + 1) * this.props.elementsOnPage > this.props.list.length ? false : true

        this.setState({
            infiniteList: this.state.infiniteList.concat(this.props.list.slice(this.state.page * this.props.elementsOnPage, upperBound)),
            page: page,
            isNext: isNext
        })
    };

    render() {
        return (
            <div id={"userShinyList" + this.props.attr} className="ushiny row mx-0  p-2 justify-content-center">
                <InfiniteScroll
                    dataLength={this.state.infiniteList.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.isNext}
                    scrollableTarget={"userShinyList" + this.props.attr}
                    scrollThreshold={0.7}
                >
                    <div className="row mx-0">
                        {this.state.infiniteList.map((value) =>
                            <UserShinyCard
                                key={this.props.attr + value.Name}

                                attr={this.props.attr}
                                value={value}

                                pokemonTable={this.props.pokemonTable}

                                onClick={this.props.onPokemonDelete}
                            />)}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }
}

export default UserShinyList
