import React from "react"
import InfiniteScroll from 'react-infinite-scroll-component'


class LazyTable extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            infiniteList: props.list.slice(0, props.elementsOnPage > props.list.length ? props.list.length : props.elementsOnPage),
            isNext: props.elementsOnPage > props.list.length ? false : true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.list === prevProps.list && this.props.activeFilter === prevProps.activeFilter) {
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
            <InfiniteScroll
                style={{ overflow: "visible" }}
                dataLength={this.state.infiniteList.length}
                next={this.fetchMoreData}
                hasMore={this.state.isNext}
                scrollThreshold={0.75}
            >
                <table className="table mb-0 table-sm text-center">
                    {this.props.thead}
                    <tbody>
                        {this.state.infiniteList}
                    </tbody>
                </table>
            </InfiniteScroll>
        );
    }
}

export default LazyTable
