import React from "react";
import Button from "../Button/Button"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"


const TypeRow = React.memo(function (props) {
    return (
        <div className={"row m-0 my-3 text-center sliderButton justify-content-center"} >
            <Button
                attr="type0"
                title={<PokemonIconer
                    folder="/type/"
                    src={0}
                    class={"icon16"}
                />}
                class={props.filter.type0 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr="type1"
                title={<PokemonIconer
                    folder="/type/"
                    src={1}
                    class={"icon16"}
                />}
                class={props.filter.type1 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type2"}
                title={<PokemonIconer
                    folder="/type/"
                    src={2}
                    class={"icon16"}
                />}
                class={props.filter.type2 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type3"}
                title={<PokemonIconer
                    folder="/type/"
                    src={3}
                    class={"icon16"}
                />}
                class={props.filter.type3 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type4"}
                title={<PokemonIconer
                    folder="/type/"
                    src={4}
                    class={"icon16"}
                />}
                class={props.filter.type4 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type5"}
                title={<PokemonIconer
                    folder="/type/"
                    src={5}
                    class={"icon16"}
                />}
                class={props.filter.type5 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type6"}
                title={<PokemonIconer
                    folder="/type/"
                    src={6}
                    class={"icon16"}
                />}
                class={props.filter.type6 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr="type7"
                title={<PokemonIconer
                    folder="/type/"
                    src={7}
                    class={"icon16"}
                />}
                class={props.filter.type7 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr="type8"
                title={<PokemonIconer
                    folder="/type/"
                    src={8}
                    class={"icon16"}
                />}
                class={props.filter.type8 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type9"}
                title={<PokemonIconer
                    folder="/type/"
                    src={9}
                    class={"icon16"}
                />}
                class={props.filter.type9 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type10"}
                title={<PokemonIconer
                    folder="/type/"
                    src={10}
                    class={"icon16"}
                />}
                class={props.filter.type10 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type11"}
                title={<PokemonIconer
                    folder="/type/"
                    src={11}
                    class={"icon16"}
                />}
                class={props.filter.type11 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type12"}
                title={<PokemonIconer
                    folder="/type/"
                    src={12}
                    class={"icon16"}
                />}
                class={props.filter.type12 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type13"}
                title={<PokemonIconer
                    folder="/type/"
                    src={13}
                    class={"icon16"}
                />}
                class={props.filter.type13 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr="type14"
                title={<PokemonIconer
                    folder="/type/"
                    src={14}
                    class={"icon16"}
                />}
                class={props.filter.type14 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr="type15"
                title={<PokemonIconer
                    folder="/type/"
                    src={15}
                    class={"icon16"}
                />}
                class={props.filter.type15 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type16"}
                title={<PokemonIconer
                    folder="/type/"
                    src={16}
                    class={"icon16"}
                />}
                class={props.filter.type16 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
            <Button
                attr={"type17"}
                title={<PokemonIconer
                    folder="/type/"
                    src={17}
                    class={"icon16"}
                />}
                class={props.filter.type17 ? "col py-1 sliderGroup active" : "col py-1 sliderGroup"}
                onClick={props.onFilter}
            />
        </div>
    )
});

export default TypeRow;