import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";
import { locale } from "locale/Raids/Raids";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const ButtonsBlock = React.memo(function ButtonsBlock(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { filter, onFilter } = props;

    return (
        <SliderBlock>
            <SliderButton attr="megaRaids" toggled={!!filter.megaRaids} onClick={onFilter}>
                {strings.tierlist.mega}
            </SliderButton>

            <SliderButton attr="tier5" toggled={!!filter.tier5} onClick={onFilter}>
                {`${strings.tierlist.raidtier} 5`}
            </SliderButton>

            <SliderButton attr="tier3" toggled={!!filter.tier3} onClick={onFilter}>
                {`${strings.tierlist.raidtier} 3`}
            </SliderButton>

            <SliderButton attr="tier1" toggled={!!filter.tier1} onClick={onFilter}>
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