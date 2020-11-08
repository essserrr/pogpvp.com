import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

class LazyTable extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            infiniteList: props.children.slice(0, props.elementsOnPage > props.children.length ? props.children.length : props.elementsOnPage),
            isNext: props.elementsOnPage > props.children.length ? false : true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.children === prevProps.children && this.props.activeFilter === prevProps.activeFilter) {
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
        return (
            <InfiniteScroll
                style={{ overflow: "visible" }}
                dataLength={this.state.infiniteList.length}
                next={this.fetchMoreData}
                hasMore={this.state.isNext}
                scrollThreshold={0.75}
            >
                <Table>
                    {this.props.thead}
                    <TableBody>
                        {this.state.infiniteList}
                    </TableBody>
                </Table>
            </InfiniteScroll>
        );
    }
}

export default LazyTable
