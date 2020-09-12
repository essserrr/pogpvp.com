import React from "react"
import InfiniteScroll from 'react-infinite-scroll-component'


class LazyTable extends React.PureComponent {
    constructor(props) {
        super();

        this.state = {
            page: 1,
            listToShow: props.list.slice(0, props.elemntsOnPage > props.list.length ? props.list.length : props.elemntsOnPage),
            isNext: props.elemntsOnPage > props.list.length ? false : true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.list === prevProps.list && this.props.activeFilter === prevProps.activeFilter) {
            return
        }

        this.setState({
            listToShow: this.props.list.slice(0, this.props.elemntsOnPage > this.props.list.length ? this.props.list.length : this.props.elemntsOnPage),
            page: 1,
            isNext: this.props.elemntsOnPage > this.props.list.length ? false : true
        })
    }


    fetchMoreData = () => {
        let page = (this.state.page + 1) * this.props.elemntsOnPage > this.props.list.length ? this.state.page : (this.state.page + 1)
        let upperBound = (this.state.page + 1) * this.props.elemntsOnPage > this.props.list.length ? this.props.list.length : (this.state.page + 1) * this.props.elemntsOnPage
        let isNext = (this.state.page + 1) * this.props.elemntsOnPage > this.props.list.length ? false : true

        this.setState({
            listToShow: this.state.listToShow.concat(this.props.list.slice(this.state.page * this.props.elemntsOnPage, upperBound)),
            page: page,
            isNext: isNext
        })
    };


    render() {
        return (
            <InfiniteScroll
                style={{ overflow: "visible" }}
                dataLength={this.state.listToShow.length}
                next={this.fetchMoreData}
                hasMore={this.state.isNext}
                scrollThreshold={0.75}
            >
                <table className="table mb-0 table-sm text-center">
                    {this.props.thead}
                    <tbody>
                        {this.state.listToShow}
                    </tbody>
                </table>
            </InfiniteScroll>
        );
    }
}

export default LazyTable
