import React, { PureComponent } from 'react';
import CloseButton from "./CloseButton"

class MagicBox extends PureComponent {
    render() {
        return (
            <div
                className={"magicBox d-flex justify-content-center mx-0 px-0"}
                value={"name"}

                attr={this.props.attr}
                onClick={this.props.onClick}
            >

                <div className="menu row mx-0 pl-0 pr-1 pt-0">
                    <div className="col-12 mx-0 px-0">
                        <CloseButton
                            onClick={this.props.onClick}
                            attr={this.props.attr}
                            className="close mx-0"
                        />
                    </div>
                    {this.props.title && <div className="col-12 mx-2 pl-0 pr-2 fBolder">
                        {this.props.title}
                    </div>}
                    <div className="col-12 mx-2 mb-2 pl-0 pr-3">
                        {this.props.element}
                    </div>

                </div>
            </div>
        );
    }
}

export default MagicBox;