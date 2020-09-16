import React from "react"

import "./News.scss"

const News = React.memo(function (props) {
    return (
        <div className={`news ${props.class ? props.class : ""}`}>
            <div className="news__title px-3 py-1">
                {props.title + "  " + props.date}
            </div>
            {<div className="news__body mx-3 pt-3" dangerouslySetInnerHTML={{ __html: props.description }} />}
        </div>
    )
});

export default News;