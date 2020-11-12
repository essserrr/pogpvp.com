export function returnPokList(pokBase, addNone, locale) {
    let pokList = [];
    if (addNone) {
        pokList.push({ value: "", title: locale, });
    }
    //create pokemons list
    for (const [key] of Object.entries(pokBase)) {
        pokList.push({
            value: key,
            title: key,
        });
    }
    return pokList;
}