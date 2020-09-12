import React from "react"
import ReactTooltip from "react-tooltip"
import LocalizedStrings from "react-localization"


import SubmitButton from "../../SubmitButton/SubmitButton"

import { locale } from "../../../../../locale/locale"
import { getCookie } from "../../../../../js/getCookie"

import "./FileImport.scss"

let strings = new LocalizedStrings(locale)

class FileImport extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


        this.state = {
            labelTitle: strings.import.file,
            lang: getCookie("appLang") ? getCookie("appLang") : "en",
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)

        this.fileInput = React.createRef()
    }


    onSubmit(event) {
        event.preventDefault()
        let file = this.fileInput.current.files[0]

        if (!file) { return }

        if (!this.checkFileFormat(file.name)) {
            this.resetActiveFile()
            return
        }

        var reader = new FileReader()
        reader.onload = (readerEvent) => {
            this.props.returnFile(reader.result)
        }

        reader.readAsText(file)
    }

    checkFileFormat(fileName) {
        let allowedFormats = this.props.acceptFile.split(", ")
        if (allowedFormats.length === 0) { return true }
        return allowedFormats.reduce((sum, val) => sum + (fileName.includes(val) ? true : false), false)
    }

    resetActiveFile() {
        this.fileInput.current.value = null
        this.setState({
            labelTitle: strings.import.file,
        })
    }


    onClick() {
        this.fileInput.current.value = null
        this.setState({
            labelTitle: strings.import.file,
        })
    }

    onChange() {
        if (!this.checkFileFormat(this.fileInput.current.files[0].name)) {
            this.resetActiveFile()
            return
        }

        this.setState({
            labelTitle: this.fileInput.current.files[0].name,
        })
    }



    render() {
        return (
            <div className="row mx-0">
                <form className="col-12 px-0" onSubmit={this.onSubmit}>

                    <ReactTooltip
                        className={"infoTip"}
                        id={"imp-exp" + this.props.attr} effect="solid"
                        place={"bottom"}
                        multiline={true}
                    >
                        {this.props.tips}
                    </ReactTooltip>



                    <div className="row mx-0 mt-3 mb-2">
                        <div className="col px-0">
                            {this.props.label}
                        </div>
                        <i data-tip data-for={"imp-exp" + this.props.attr} className="align-self-center fas fa-info-circle fa-lg ml-4"></i>
                    </div>
                    <div className="custom-file">
                        <input
                            type="file"
                            className="custom-file-input"

                            ref={this.fileInput}
                            id="customFile"

                            lang={this.state.lang}
                            accept={this.props.acceptFile}

                            onClick={this.onClick}
                            onChange={this.onChange}
                        />
                        <label className="importfile__select-button custom-file-label" htmlFor="customFile">{this.state.labelTitle}</label>
                    </div>

                    <div className="row mx-0 justify-content-center align-items-center my-3">
                        <SubmitButton
                            label={strings.import.read}
                            onSubmit={this.onSubmit}
                            class="matrixButton btn btn-primary btn-sm p-0 m-0"
                        />
                    </div>
                </form>
            </div>
        )
    }

}

export default FileImport