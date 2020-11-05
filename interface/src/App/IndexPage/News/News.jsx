import React from "react";
import propTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    news: {
        border: `1px solid ${theme.palette.news.border}`,
        overflow: "hidden",
    },
    newsTitle: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        backgroundColor: theme.palette.background.main,
        borderBottom: `1px solid ${theme.palette.news.border}`,
    },
    newsBody: {
        padding: `${theme.spacing(2.5)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
}));

const News = React.memo(function News(props) {
    const classes = useStyles();

    return (
        <Paper elevation={4} className={classes.news}>
            <Grid container>
                <Grid item xs={12} className={classes.newsTitle}>
                    <Typography variant="h6">
                        {`${props.title}  ${props.date}`}
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.newsBody} >
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: props.description }} />
                </Grid>
            </Grid>
        </Paper>
    )
});

export default News;

News.propTypes = {
    title: propTypes.string,
    date: propTypes.string,
    description: propTypes.string,
};