export class MovePoolBuilder {
    constructor() {
        this.pokemon = {};
        //generated 
        this.quickMovePool = [];
        this.chargeMovePool = [];
    }

    createMovePool(name, pokTable, locale, isBoss, additionalQ, addtionalCh) {
        if (!pokTable || !name || !pokTable[name]) return;
        this.pokemon = { ...pokTable[name] };
        this.filterMoves(isBoss);

        this.quickMovePool = this.returnMovePool(locale, this.pokemon.QuickMoves, additionalQ);
        this.chargeMovePool = this.returnMovePool(locale, this.pokemon.ChargeMoves, addtionalCh);
    }

    filterMoves(isBoss) {
        this.pokemon.QuickMoves = this.pokemon.QuickMoves.filter(elem => (isBoss && !!this.pokemon.EliteMoves[elem]) ? false : elem !== "");
        this.pokemon.ChargeMoves = this.pokemon.ChargeMoves.filter(elem => (isBoss && (!!this.pokemon.EliteMoves[elem] || elem === "Return")) ? false : elem !== "");
    }

    returnMovePool(locale, moves, additionalMoves) {
        let movePool = [{ value: "", title: locale.none }];
        moves.forEach(moveName => {
            movePool.push({ value: moveName, title: `${moveName}${!!this.pokemon.EliteMoves[moveName] ? "*" : ""}` });
        });
        this.pushAdditional(additionalMoves, moves, movePool);
        movePool.push({ value: "Select...", title: locale.select });
        return movePool;
    }

    pushAdditional(additionalMoves, moves, movePool) {
        if (!additionalMoves || !moves || !movePool) return;
        //iterate over additional moves
        additionalMoves.forEach((item, i) => {
            //if additional move is invalid somehow  - skip
            if (!item) return;
            if (!moves.includes(item)) movePool.push({ value: item, title: `${item}*` });
        });
    }
}