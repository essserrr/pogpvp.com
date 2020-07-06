import React from "react";


const News = React.memo(function (props) {
    return (
        <div className={props.class}>
            <div className="singleNewsTitle">
                {props.title + "  " + props.date}
            </div>
            {<div className="singleNewsBody" dangerouslySetInnerHTML={{ __html: props.description }} />}
        </div>
    )
});

export default News;