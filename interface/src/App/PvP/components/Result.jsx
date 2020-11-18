import React from "react";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';

import SinglePvpResults from "./SinglePvpResults/SinglePvpResults";

class Result extends React.PureComponent {
    constructor() {
        super();
        this.matrixres = React.createRef();
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        if (this.props.enableFocus) {
            this.focusDiv();
        }
    };
    componentDidUpdate() {
        if (this.props.enableFocus) {
            this.focusDiv();
        }
    };

    focusDiv() {
        this.matrixres.current.focus();
    };

    render() {
        return (
            <Box tabIndex="0" ref={this.matrixres}>
                {this.props.isSingle ?
                    <SinglePvpResults value={this.props.children} />
                    :
                    this.props.children}
            </Box>
        );
    }
};

export default Result;

Result.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    isSingle: PropTypes.bool,
    enableFocus: PropTypes.bool,
};