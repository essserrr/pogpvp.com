import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import UserPokCard from "App/Userpage/CustomPokemon/PokemonBox/UserPokemonList/UserPokCard/UserPokCard";

const styles = theme => ({
    uPokList: {
        minHeight: "62px",
        maxHeight: "250px",
        border: `1px solid ${theme.palette.text.primary}`,
        borderRadius: "5px",
        overflowY: "auto",
    },
});

class UserPokemonList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            infiniteList: props.children.slice(0, props.elementsOnPage > props.children.length ? props.children.length : props.elementsOnPage),
            isNext: props.elementsOnPage > props.children.length ? false : true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.children === prevProps.children) { return }
        //update infinite scroll position
        const listLength = this.props.children.length

        this.setState({
            infiniteList: this.props.children.slice(0, this.props.elementsOnPage > listLength ? listLength : this.props.elementsOnPage),
            page: 1,
            isNext: this.props.elementsOnPage > listLength ? false : true
        })
    }


    fetchMoreData = () => {
        const listLength = this.props.children.length
        const nextPage = (this.state.page + 1) * this.props.elementsOnPage > listLength ? this.state.page : (this.state.page + 1)
        const upperBound = (this.state.page + 1) * this.props.elementsOnPage > listLength ? listLength : (this.state.page + 1) * this.props.elementsOnPage
        const isNext = (this.state.page + 1) * this.props.elementsOnPage > listLength ? false : true

        this.setState({
            infiniteList: this.state.infiniteList.concat(this.props.children.slice(this.state.page * this.props.elementsOnPage, upperBound)),
            page: nextPage,
            isNext: isNext
        })
    };


    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" id={`userPokemonList${this.props.attr}`} className={classes.uPokList}>
                <InfiniteScroll
                    dataLength={this.state.infiniteList.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.isNext}
                    scrollableTarget={`userPokemonList${this.props.attr}`}
                    scrollThreshold={0.7}
                >
                    <Grid container justify="space-around">
                        {this.state.infiniteList.map((value, index) =>
                            <UserPokCard
                                style={{ minWidth: "190px" }}
                                key={index}
                                index={index}

                                attr={this.props.attr}

                                moveTable={this.props.moveTable}
                                pokemonTable={this.props.pokemonTable}

                                onClick={this.props.onPokemonDelete}
                                onPokemonEdit={this.props.onPokemonEdit}

                                {...value}
                            />)}
                    </Grid>
                </InfiniteScroll>
            </Grid>
        );
    }
};

export default withStyles(styles, { withTheme: true })(UserPokemonList);

UserPokemonList.propTypes = {
    onPokemonEdit: PropTypes.func,
    onPokemonDelete: PropTypes.func,

    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,

    attr: PropTypes.string,
    elementsOnPage: PropTypes.number,


    index: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),

    children: PropTypes.arrayOf(PropTypes.object),
};