import React from "react";
import { Helmet } from "react-helmet";

const SiteHelm = React.memo(function (props) {
    return (
        <Helmet>
            <link rel="canonical" href={props.url} />
            <title>{props.header}</title>
            <meta name="description" content={props.descr} />

            <meta property="og:title" content={props.header} />
            <meta property="og:url" content={props.url}></meta>
            <meta property="og:description" content={props.descr} />

            <meta property="twitter:title" content={props.header} />
            <meta property="twitter:url" content={props.url}></meta>
            <meta property="twitter:description" content={props.descr} />
        </Helmet>
    )

});

export default SiteHelm;