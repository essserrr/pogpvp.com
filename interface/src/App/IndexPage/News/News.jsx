import React from "react";


const News = React.memo(function (props) {
    return (
        <div className={props.class}>
            <div className="singleNewsTitle px-3 py-1">
                {props.title + "  " + props.date}
            </div>
            {<div className="singleNewsBody mx-3 pt-3" dangerouslySetInnerHTML={{ __html: props.description }} />}
        </div>
    )
});

export default News;