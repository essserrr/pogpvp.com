export const singleTips = {
    en: {
        intr: "Single PvP calculates the results of a battle between two pokemon according to the chosen strategy.",

        rate: "Battle rating",
        ratep1: "The concept of battle rating was borrowed from pvpoke (so that the results of two simulators are easily comparable to each other). On pvpoke, the rating reflects whether the Pokémon won the battle or lost, and how much he lost or won. The rating is calculated using the following formula:",
        ratep2: "R = (500 x (Damage dealt / Opponent’s max HP)) + (500 x (HP remaining / Max HP)). ",
        ratep3: "Here a rating of 500 means a tie (500 points for the damage dealt, 0 points for the remaining HP), a rating of 1000 means an absolute victory when we defeated an opponent without losing a single HP (500 + 500), and 0 an absolute defeat when a pokemon lost without dealing a single point of damage (0 + 0).",

        max: "Maximizer",
        maxp1: "Sets the parameters of a pokemon in accordance with the selected filters, namely:",
        maxul: {
            li1: "Atk + max - maximizes mon`s attack parameter;",
            li2: "Def + max - maximizes mon`s defense parameter;",
            li3: "General + max - maximizes all parameters (by finding top-1 statroduct result);",
            li4: "Normal - sets mon`s  parameters to the top-100 by statproduct.",
        },

        move: "Move selection",
        movep1: "When choosing a new Pokemon, an selection of the best moveset takes place (without taking into account the type of opponent!).",
        movep2: "A quick move with the maximum sqrt(DPS * EPS ^ 2) is considered as the best quick move. This algorithm allows to choose a move with the best balance of damage per second and generated energy per second.",
        movep3: "The choice of charge moves is made according to the following scheme:",
        moveul: {
            li1: "Defined by DPE2 = damage / sqr (energy);",
            li2: "A move with the highest DPE2 is selected as the primary move; if two moves have the same DPE2, then the move with the lower energy is selected. Move that reduce your own parameters cannot be selected as the primary move (for example, Raikou's Wild Charge);",
            li3: "A move with the second largest DPE2 is selected as the secondary move. The algorithm selects a move with a type different from the type of the first move (if possible) to ensure greater coverage. The restriction on the reduction of own parameters does not apply in this case.",
        },

        alg: "Solution algorithm",
        algp1: "For each battle, a tree of events is built. The tree of events is solved, so that to find the best outcome for each of the opponents. The following restrictions apply to the simulator:",
        algul1: {
            li1: "Pokemon cannot skip a round without taking any action;",
            li2: "Pokemon cannot skip using a charge mov 2 times in a row. For example, if a pokemon decides to wait a bit to charge a move that requires more energy, then when the energy accumulates, he will not be able to change his mind and wait a little more; he is guaranteed to use this move. This assumption is mentioned because of the importance in battles that are won without the use of  charge moves;",
            li3: "Also, due to the nature of the tree solution, Mons can predict the actions of the opponent and always act out in accordance with them, and they are never mistaken.",
        },
        algp2: "In the process of solving 2 strategies can be involved:",
        algul2: {
            li1: "Greedy. Each time a pokemon makes a choice in the battle, he will make such a choice, thanks to which he will get the maximum battle rating at the end of the battle, regardless of the number of shields used. In this mode, the pokemon skips the use of shields only if the use and non-use of the shield leads to the same value of the final rating;",
            li2: "Shieldsaving. Pokemon always chooses the action leading to victory, if the choice is between victory and defeat. If the choice is between victory and victory (he will win in both cases, using and not using a shield), then he will choose not to use a shield. If the choice is between defeat and defeat, then the pokemon will choose the option in which he will save the most shields, and the enemy will lose the most shields, while he will strive for the highest rating at the end of the battle.",
        },
        algp3: "Also, all strategies take into account the amount of energy remained at the end of the battle. So if possible, a solution in which the pokemon has more energy at the end of the battle will be selected (only affects winning situations).",
        constr: "Constructor",
        constrp1: `In the single PvP, constructor mode is available. In this mode, you can edit any action of your choice in the results of the battle. To do this, click on the "enable constructor" button and click on any action in the battle results. After clicking on the “submit” button, the battle results will be recalculated from the selected round to the end of the PvP.`,
        constrp2: "!!! Remember that if you edited the results of a battle in round 20, and then decided to re-edit the actions in round 10, then your changes in round 20 will be lost.",


    },
    ru: {
        intr: "Одиночное PvP рассчитывает результаты боя между двумя покемонами по выбранной стратегии.",

        rate: "Боевой рейтинг",
        ratep1: "Концепция боевого рейтинга была заимствована на pvpoke (что бы результаты двух симуляторов были легко сравнимы между собой). На pvpoke рейтинг отражает то, победил покемон битву или проиграл, а также на сколько сильно он проиграл или выиграл. Рейтинг рассчитывается по следующей формуле:",
        ratep2: "R = (500 x (Нанесенный урон / Максимальное HP оппонента)) + (500 x (Оставшееся HP / Максимальное HP)).",
        ratep3: "Здесь рейтинг равный 500 означает ничью (500 очков за нанесенный урон, 0 очков за оставшиеся HP), рейтинг равный 1000 означает абсолютную победу, когда мы победили оппонента, не потеряв ни одного HP (500 + 500), а 0 абсолютное поражение, когда покемон проиграл, не нанеся ни одного очка урона (0+0).",

        max: "Максимизатор",
        maxp1: "Устанавливает параметры покемона в соответствии с выбранными фильтрами, а именно:",
        maxul: {
            li1: "Атк + макс - максимизирует параметр атаки;",
            li2: "Защ + макс - максимизирует параметр защиты;",
            li3: "Общий + макс - максимизирует все параметры вычисляя statproduct;",
            li4: "Обычный - устанавливает параметры покемона в топ-100 по statproduct.",
        },

        move: "Выбор умений",
        movep1: "При выборе нового покемона происходит примерный подбор лучших умений (без учета типа противника!).",
        movep2: "В качестве лучшего быстрого умения выбирается быстрое умение с максимальным sqrt(DPS*EPS^2). Это позволяет выбирать умения с лучшим балансом урона в секунду и получаемой энергии в секунду.",
        movep3: "Выбор заряжаемого умения происходит по следующей схеме:",
        moveul: {
            li1: "Определяется DPE^2 = урон / sqr(энергия);",
            li2: "В качестве первого умения выбирается умение с максимальным DPE2, если у двух умений одинаковый DPE2, то выбирается умение с меньшей энергией. Умения уменьшающие собственный параметры не могут стать первым умением (например, Wild Charge у Raikou);",
            li3: "В качестве второго умения выбирается умение со вторым по величине DPE2, при чем алгоритм выбирает умение с типом, отличным от типа первого умения (если это возможно), что бы обеспечить большую универсальность покемона. Ограничение на уменьшение собственных параметров в этом случае не действуют.",
        },

        alg: "Алгоритм решения",
        algp1: "Для каждого боя строится дерево развития событий, после чего дерево решается, так что бы найти наилучший вариант исхода для каждого из противников. В симуляторе действуют следующие ограничения:",
        algul1: {
            li1: "Покемоны не могут пропускать раунд, не совершив никакого действия;",
            li2: "Покемоны не могут 2 раза подряд не использовать никакого умения (например, если покемон решил подождать немного, что бы зарядилось умение, требующее большее количество энергии, то, когда энергия накопится, он не сможет передумать и подождать еще немного; он гарантированно использует это умение) – это допущение упомянуто в связи с важностью в боях, которые выигрываются без использования заряжаемых умений;",
            li3: "Так же в связи с природой решения, покемоны предсказывают действия оппонента и всегда отыгрывают в соответствии с ними, при этом никогда не ошибаются.",
        },
        algp2: "В процессе решения могут быть задействованы 2 стратегии:",
        algul2: {
            li1: "Жадная. Каждый раз, когда покемон делает выбор в бою, он будет делать такой выбор, благодаря которому он получит максимальный рейтинг на конец боя, невзирая на количество щитов. В этом режиме покемон пропускает использование щитов только в том случае, когда использование и не использование щита приводит к одной и той же величине итогового рейтинга;",
            li2: "С сохранением щитов. Покемон всегда выбирает действие, приводящее к победе, если выбор идет между победой и поражением. Если выбор идет между победой и победой (он победит в обоих случаях, использовав и не использовав щит), то он будет выбирать не использовать щит. Если выбор идет между поражением и поражением, то покемон будет выбирать вариант, в котором он сохранит наибольшее количество щитов, а противник потеряет наибольшее количество щитов, при этом он будет стремиться к наивысшему рейтингу на конец боя.",
        },
        algp3: "Так же все стратегии учитывают количество энергии на конец боя, поэтому, если есть возможность, будет выбираться решение, в котором у покемона осталось больше энергии на конец боя (действует только на выигрышные ситуации).",
        constr: "Конструктор",
        constrp1: `Так же в одиночном PvP доступен режим конструктора. В режиме конструктора вы можете отредактировать любое действие по своему усмотрению в результатах боя. Для этого нужно нажать на кнопку "включить конструктор" и кликнуть по любому действию в результатах боя. После нажатия на кнопку "подтвердить", результаты боя пересчитаются с выбранного раунда и до конца PvP.`,
        constrp2: "!!! Помните, что если вы отредактировали результаты боя в 20 раунде, а затем решили вновь отредактировать действия в 10 раунде, то ваши изменения в 20 раунде будут потеряны.",
    }
}