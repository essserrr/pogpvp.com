import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import Grid from '@material-ui/core/Grid';

import News from "App/IndexPage/News/News";

const NewsList = React.memo(function NewsList(props) {
    return (
        <Grid container justify="center" spacing={2}>
            {props.children.map((elem, i) => {
                const parsed = JSON.parse(elem)
                return (
                    <Grid key={i} item xs={12}>
                        <Link to={(navigator.userAgent === "ReactSnap") ? "/" : `/news/id/${parsed.ID}`}>
                            <News
                                title={parsed.Title}
                                date={parsed.Date}
                                description={parsed.ShortDescription}
                            />
                        </Link>
                    </Grid>
                )
            })}
        </Grid>
    )
});

export default NewsList;

NewsList.propTypes = {
    children: PropTypes.array,
};