import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import UserShinyCard from "./UserShinyCard/UserShinyCard";

const styles = theme => ({
    uShinyList: {
        minHeight: "62px",
        maxHeight: "250px",
        padding: `${theme.spacing(1)}px`,

        border: `1px solid ${theme.palette.text.primary}`,
        borderRadius: "5px",
        overflowY: "auto",
    },
});


class UserShinyList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            infiniteList: props.children.slice(0, props.elementsOnPage > props.children.length ? props.children.length : props.elementsOnPage),
            isNext: props.elementsOnPage > props.children.length ? false : true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.list === prevProps.list) {
            return
        }

        this.setState({
            infiniteList: this.props.children.slice(0, this.props.elementsOnPage > this.props.children.length ? this.props.children.length : this.props.elementsOnPage),
            page: 1,
            isNext: this.props.elementsOnPage > this.props.children.length ? false : true
        })
    }


    fetchMoreData = () => {
        let page = (this.state.page + 1) * this.props.elementsOnPage > this.props.children.length ? this.state.page : (this.state.page + 1)
        let upperBound = (this.state.page + 1) * this.props.elementsOnPage > this.props.children.length ? this.props.children.length : (this.state.page + 1) * this.props.elementsOnPage
        let isNext = (this.state.page + 1) * this.props.elementsOnPage > this.props.children.length ? false : true

        this.setState({
            infiniteList: this.state.infiniteList.concat(this.props.children.slice(this.state.page * this.props.elementsOnPage, upperBound)),
            page: page,
            isNext: isNext
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="center" id={`userShinyList${this.props.attr}`} className={classes.uShinyList}>
                <InfiniteScroll
                    dataLength={this.state.infiniteList.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.isNext}
                    scrollableTarget={`userShinyList${this.props.attr}`}
                    scrollThreshold={0.7}
                >
                    <Grid container justify="space-between">
                        {this.state.infiniteList.map((value) =>
                            <UserShinyCard
                                key={this.props.attr + value.Name}

                                attr={this.props.attr}
                                value={value}

                                pokemonTable={this.props.pokemonTable}

                                onClick={this.props.onPokemonDelete}
                            />)}
                    </Grid>
                </InfiniteScroll>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(UserShinyList);

UserShinyList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    onPokemonDelete: PropTypes.func,

    pokemonTable: PropTypes.object,

    elementsOnPage: PropTypes.number,
    attr: PropTypes.string,
};