import React, { PureComponent } from 'react';

class SeparatedBlock extends PureComponent {
    render() {
        return (
            <>
                <div className={this.props.separator ? "row justify-content-center p-0 m-0 mb-2" : "row justify-content-center p-0 m-0"}>
                    {this.props.elem}
                </div>
                {this.props.separator}
            </>
        );
    }
}

export default SeparatedBlock;