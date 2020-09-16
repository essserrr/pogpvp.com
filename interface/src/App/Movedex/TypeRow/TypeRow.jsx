import React from "react"
import Button from "../MoveCard/DoubleSlider/Button/Button"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"

import "./TypeRow.scss"

const TypeRow = React.memo(function (props) {
    return (
        <div className={"typeslider-group row m-0 my-3 text-center justify-content-center"} >
            <Button
                attr="type0"
                title={<PokemonIconer
                    folder="/type/"
                    src={0}
                    class={"type-row__icon"}
                />}
                class={props.filter.type0 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="type1"
                title={<PokemonIconer
                    folder="/type/"
                    src={1}
                    class={"type-row__icon"}
                />}
                class={props.filter.type1 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type2"}
                title={<PokemonIconer
                    folder="/type/"
                    src={2}
                    class={"type-row__icon"}
                />}
                class={props.filter.type2 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type3"}
                title={<PokemonIconer
                    folder="/type/"
                    src={3}
                    class={"type-row__icon"}
                />}
                class={props.filter.type3 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type4"}
                title={<PokemonIconer
                    folder="/type/"
                    src={4}
                    class={"type-row__icon"}
                />}
                class={props.filter.type4 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type5"}
                title={<PokemonIconer
                    folder="/type/"
                    src={5}
                    class={"type-row__icon"}
                />}
                class={props.filter.type5 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type6"}
                title={<PokemonIconer
                    folder="/type/"
                    src={6}
                    class={"type-row__icon"}
                />}
                class={props.filter.type6 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="type7"
                title={<PokemonIconer
                    folder="/type/"
                    src={7}
                    class={"type-row__icon"}
                />}
                class={props.filter.type7 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="type8"
                title={<PokemonIconer
                    folder="/type/"
                    src={8}
                    class={"type-row__icon"}
                />}
                class={props.filter.type8 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type9"}
                title={<PokemonIconer
                    folder="/type/"
                    src={9}
                    class={"type-row__icon"}
                />}
                class={props.filter.type9 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type10"}
                title={<PokemonIconer
                    folder="/type/"
                    src={10}
                    class={"type-row__icon"}
                />}
                class={props.filter.type10 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type11"}
                title={<PokemonIconer
                    folder="/type/"
                    src={11}
                    class={"type-row__icon"}
                />}
                class={props.filter.type11 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type12"}
                title={<PokemonIconer
                    folder="/type/"
                    src={12}
                    class={"type-row__icon"}
                />}
                class={props.filter.type12 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type13"}
                title={<PokemonIconer
                    folder="/type/"
                    src={13}
                    class={"type-row__icon"}
                />}
                class={props.filter.type13 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="type14"
                title={<PokemonIconer
                    folder="/type/"
                    src={14}
                    class={"type-row__icon"}
                />}
                class={props.filter.type14 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr="type15"
                title={<PokemonIconer
                    folder="/type/"
                    src={15}
                    class={"type-row__icon"}
                />}
                class={props.filter.type15 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type16"}
                title={<PokemonIconer
                    folder="/type/"
                    src={16}
                    class={"type-row__icon"}
                />}
                class={props.filter.type16 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type17"}
                title={<PokemonIconer
                    folder="/type/"
                    src={17}
                    class={"type-row__icon"}
                />}
                class={props.filter.type17 ? "typeslider-group__button active col py-1" : "typeslider-group__button col py-1"}
                onClick={props.onFilter}
            />
        </div>
    )
});

export default TypeRow;