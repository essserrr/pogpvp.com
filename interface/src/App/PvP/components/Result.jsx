import React from "react";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';

import SinglePvpResults from "./SinglePvpResults/SinglePvpResults";
import TableWrapper from "./TableBodyRender/TableWrapper/TableWrapper";

class Result extends React.PureComponent {
    constructor() {
        super();
        this.matrixres = React.createRef();
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        this.focusDiv();
    };
    componentDidUpdate() {
        this.focusDiv();
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
                    <TableWrapper>
                        {this.props.children}
                    </TableWrapper>}
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
};