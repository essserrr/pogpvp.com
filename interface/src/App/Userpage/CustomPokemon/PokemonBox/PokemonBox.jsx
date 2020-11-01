import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';

import Filters from "App/Userpage/CustomPokemon/PokemonBox/Filters/Filters"
import PokemonBoxTitle from "App/Userpage/CustomPokemon/PokemonBox/PokemonBoxTitle/PokemonBoxTitle"
import SubmitRow from "App/Userpage/CustomPokemon/PokemonBox/SubmitRow/SubmitRow"


import UserFilteredList from "./UserFilteredList/UserFilteredList"
import MagicBox from "App/PvP/components/MagicBox/MagicBox"
import ImportExport from "App/PvP/components/ImportExport/ImportExport"

class PokemonBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showCollapse: false,

            filters: {
                Name: "",
                QuickMove: "",
                ChargeMove: "",

                Atk: "",
                Def: "",
                Sta: "",
                Lvl: "",

                IsShadow: "",
            },
        }
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onChange(event, attributes) {
        console.log(event.target.name, event.target.value, attributes.attr)
        this.setState({
            [attributes.attr]: {
                ...this.state[attributes.attr],
                [event.target.name]: event.target.value,
            }
        })
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
        })
    }

    render() {
        return (
            <Grid container justify="center" spacing={2}>
                <MagicBox
                    open={this.props.showImportExportPanel}
                    onClick={this.props.onTurnOnImport}
                    attr={this.props.attr}
                >
                    <ImportExport
                        type="userPokemon"
                        initialValue={Object.values(this.props.userList)}
                        pokemonTable={this.props.pokemonTable}

                        action="Import/Export"
                        attr={this.props.attr}
                        onChange={this.props.onImport}
                    />
                </MagicBox>

                <Grid item xs={12}>
                    {this.props.children}
                </Grid>
                <Grid item xs={12}>
                    <SubmitRow
                        attr={this.props.attr}
                        onPokemonAdd={this.props.onPokemonAdd}
                        onTurnOnImport={this.props.onTurnOnImport}
                    />
                </Grid>


                <Grid item xs={12}>
                    <PokemonBoxTitle
                        onClick={this.onClick}
                        have={this.props.userList.length}
                        limit={this.props.limit}
                        showCollapse={this.state.showCollapse}
                    />

                    <Collapse in={this.state.showCollapse}>
                        <Box mb={2}>
                            <Filters
                                value={this.state.filters}
                                attr="filters"
                                onChange={this.onChange}
                            />
                        </Box>
                    </Collapse>
                    <UserFilteredList
                        attr={this.props.attr}
                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        filters={this.state.filters}

                        onPokemonDelete={this.props.onPokemonDelete}
                        onPokemonEdit={this.props.onPokemonEdit}
                    >
                        {this.props.userList}
                    </UserFilteredList>
                </Grid>
            </Grid>
        );
    }
}

export default PokemonBox;

SubmitRow.PropTypes = {
    limit: PropTypes.number,
    attr: PropTypes.string,

    onImport: PropTypes.func,
    onTurnOnImport: PropTypes.func,
    showImportExportPanel: PropTypes.bool,


    onPokemonAdd: PropTypes.func,
    onPokemonDelete: PropTypes.func,
    onPokemonEdit: PropTypes.func,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    userList: PropTypes.arrayOf(PropTypes.object),

    children: PropTypes.node.isRequired
};

