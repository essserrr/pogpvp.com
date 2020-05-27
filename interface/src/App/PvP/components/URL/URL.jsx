import React from "react";
import LabelPrepend from "../SelectGroup/LabelPrepend"
import Input from "../Input/Input"



class URL extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTip: ""
        };
        this.onClick = this.onClick.bind(this);
    }



    async onClick(event) {
        event.target.select();
        document.execCommand('copy');
        this.setState({
            showTip: true
        })

        await new Promise(res => setTimeout(res, 600));
        this.setState({ showTip: false })
    }

    onChange() {

    }


    render() {
        return (
            <>

                <div className="url input-group input-group-sm">
                    <LabelPrepend
                        tipClass="infoTip"
                        label={this.props.label}

                        for={this.props.for}
                        tip={this.props.tip}
                        place={this.props.place}
                    />
                    {this.state.showTip && <div className="absoluteTip">
                        {this.props.message}
                    </div>}
                    <Input
                        value={this.props.value}
                        onClick={this.onClick}
                        onChange={this.onChange}
                        readonly={true}
                    />

                </div>
            </>

        )
    }

}
export default URL;