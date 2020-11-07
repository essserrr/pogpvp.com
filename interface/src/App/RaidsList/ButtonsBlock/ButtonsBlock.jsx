import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";
import { locale } from "locale/Raids/Raids";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const useStyles = makeStyles((theme) => ({
    buttonSpacing: {
        paddingLeft: "5px",
        paddingRight: "5px",

        "@media (max-width: 768px)": {
            paddingLeft: "2px",
            paddingRight: "2px",
        },
        "@media (max-width: 576px)": {
            paddingLeft: "1px",
            paddingRight: "1px",
        },
    },
}));

const ButtonsBlock = React.memo(function ButtonsBlock(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();
    const { filter, onFilter } = props;

    return (
        <SliderBlock>
            <SliderButton className={classes.buttonSpacing} attr="megaRaids" toggled={!!filter.megaRaids} onClick={onFilter}>
                {strings.tierlist.mega}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="tier5" toggled={!!filter.tier5} onClick={onFilter}>
                {`${strings.tierlist.raidtier} 5`}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="tier3" toggled={!!filter.tier3} onClick={onFilter}>
                {`${strings.tierlist.raidtier} 3`}
            </SliderButton>

            <SliderButton className={classes.buttonSpacing} attr="tier1" toggled={!!filter.tier1} onClick={onFilter}>
                {`${strings.tierlist.raidtier} 1`}
            </SliderButton>
        </SliderBlock>
    )

});

export default ButtonsBlock;

ButtonsBlock.propTypes = {
    filter: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
};