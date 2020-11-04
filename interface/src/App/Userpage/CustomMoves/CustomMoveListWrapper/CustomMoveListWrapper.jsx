import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import SaveIcon from '@material-ui/icons/Save';

import { refresh } from "AppStore/Actions/refresh";
import { setCustomMoves } from "AppStore/Actions/actions";

import AuthButton from "App/Registration/RegForm/AuthButton/AuthButton"
import CustomMoveList from "App/Userpage/CustomMoves/CustomMoveListWrapper/CustomMoveList/CustomMoveList"
import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomMoves/CustomMoves";

let strings = new LocalizedStrings(userLocale)

class CustomMoveListWrapper extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            submitting: false,
            error: "",
            ok: false,
        }
    }

    onSaveChanges = async () => {
        this.setState({
            submitting: true, error: "", ok: false,
        })
        try {
            await this.props.refresh()
            const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/setmoves", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ Moves: this.props.children })
            })
            //parse answer
            const data = await response.json();
            //if response is not ok, handle error
            if (!response.ok) {
                throw data.detail
            }
            //set global movelist
            this.props.setCustomMoves(this.props.moves)
            //show ok
            this.setState({ submitting: false, ok: true, })
            await new Promise(res => setTimeout(res, 4000));
            this.setState({ ok: false })
        } catch (e) {
            this.setState({
                submitting: false,
                error: String(e),
            });
        }
    }

    render() {
        const customMoves = Object.entries(this.props.children).map((value) => value[1]).sort((a, b) => a.Title.localeCompare(b.Title))
        return (
            <Grid container justify="center">
                <Grid item xs={12}>
                    <CustomMoveList
                        onMoveOpen={this.props.onMoveOpen}
                        onMoveDelete={this.props.onMoveDelete}
                    >
                        {customMoves}
                    </CustomMoveList>
                </Grid>
                <Grid item xs={12} container justify="center">
                    <Box mt={2}>
                        <AuthButton
                            loading={this.state.submitting}
                            title={strings.moveconstr.changes}
                            endIcon={<SaveIcon />}
                            onClick={this.onSaveChanges}
                        />
                    </Box>
                </Grid>
                {this.state.error !== "" &&
                    <Box mt={2}>
                        <Alert variant="filled" severity="error">{this.state.error}</Alert >
                    </Box>}
                <Snackbar open={this.state.ok} onClose={() => { this.setState({ ok: false }) }}>
                    <Alert variant="filled" severity="success">{strings.moveconstr.success}</Alert >
                </Snackbar>
            </Grid>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        setCustomMoves: moves => dispatch(setCustomMoves(moves))
    }
}
export default connect(
    null, mapDispatchToProps
)(CustomMoveListWrapper)

CustomMoveListWrapper.propTypes = {
    children: PropTypes.object,
    onMoveOpen: PropTypes.func,
    onMoveDelete: PropTypes.func,
};