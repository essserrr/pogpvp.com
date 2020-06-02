export const singleTips = {
    en: {
        intr: "PvP rating shows the potential of pokemon in the current meta.",

        rate: "About rating",
        ratep1: "The rating is defined based on average battle rating for each pokemon, taking into account the weight of its opponents in the meta. That is, if a pokemon can win against the often-encountered PvP pokemon, it is more likely to get a high score. However, here lies the other side of this approach, the rating is very dependent on the size of the weights (how much opponents are popular in the game), so even small changes in the weights can greatly change the rating.",
        ratep2: `The pokemon "score" is a percentage, reflecting the value of the weighted battle rating. The score is determined relative to the maximum weighted battle rating in each specific table. For example, in the overall rating table for the great league, the maximum value of the battle rating has Pokemon A - 1000, and the second in the top - Pokemon B, 900. Then the Pokemon A score will be 1000 / 1000 * 100 = 100, and the Pokemon B 900 / 1000 * 100 = 90.`,
        ratep3: `"Average rating" and "average winrate" show the average combat rating and win rate without taking weights into consideration.`,

        alg: "About algorithm",
        algp1: "The rating calculation algorithm works in 4 stages:",
        algul1: {
            li1: "Preparation. A list of moves with the best rating is selected for each pokemon. A list of possible movesets is compiled from that move list. PvP is calculated for each moveset of each pokemon against each moveset of every other pokemon;",
            li2: "Preprocessing. For each moveset of each pokemon against each moveset of every other pokemon, an average rating is calculated. Each pokemon is assigned a main moveset (highest rated moveset);",
            li3: "Move weighing. A weighted rating is calculated for each moveset of each pokemon against each MAIN moveset of every other pokemon. The moveset with the best weighted rating replaces the main moveset selected in the previous step;",
            li4: "Pokemon weighing. A new weighted rating is calculated for each main moveset of each pokemon each main moveset of every other pokemon. Based on the results of this weighing, pokemon get their ranks.",
        },


        move: "About best matchups, counters and best movesets",
        movep1: "After the rating calculation, the best and worst matchaups (counters) (up to 10) are selected. To do this, the opponents of each pokemon are sorted by rating value. After that pokemon that have weight in the meta are selected from the list, and if there are none left, then pokemon with the highest rating are selected. Thus, the list of best / worst matchups will always contain relevant information (it makes no sense to include Stramie to the best matchups of Venusaur, as Stramie is not used PvP). To the right of the name of a pokemon is the value of its average NOT WEIGHTED rating.",
        movep2: "!!! Clicking on the worst / best matchup will redirect you to the PvP page of this matchup without closing the rating page.",
        movep3: "Rankings sheet of each pokemon also has a list of the best movesets (up to 3). These movesets are arranged in decreasing order of the weighted rating, i.e. the first one will always be a movset with t maximum weighted rating. To the right of the name of the moveset is the size of its average NOT WEIGHTED rating.",
    },
    ru: {
        intr: "PvP рейтинг показывает то, на сколько будет потенциально хорош покемон в текущей мете.",

        rate: "О рейтинге",
        ratep1: "Рейтинг берет за основу среднюю величину боевого рейтинга для каждого покемона с учетом веса его оппонентов в мете. То есть, если покемон может выигрывать против часто встречающихся в PvP покемонов, он с большей вероятностью получит высокий счет. Однако, тут кроется и другая сторона этого подхода, рейтинг очень зависим от величины весов (того на сколько противники популярны в игре), поэтому даже небольшие изменения в весах могут сильно изменять общий облик рейтинга.",
        ratep2: `"Счет" покемона является величиной в процентах, отражающей размер взвешенного боевого рейтинга. Счет определяется относительно максимального взвешенного боевого рейтинга в каждой конкретной таблице. Например, в таблице общего рейтинга для грейт лиги максимальное значение боевого рейтинга имеет покемон А – 1000 рейтинга, а второй в топе - покемон Б, 900 рейтинга. Тогда счет покемона А будет 1000 / 1000 * 100 = 100, а покемона Б 900 / 1000 * 100 = 90.`,
        ratep3: `"Средний рейтинг" и "средний процент побед" показывают средний боевой рейтинг и процент побед без учета весов.`,

        alg: "Об алгоритме",
        algp1: "Алгоритм подсчета рейтинга работает в 4 этапа:",
        algul1: {
            li1: "Подготовительный этап. Для всех покемонов выбирается список мувов с наилучшим рейтингом. Из списка этих мувов составляется список возможных мувсетов. Для каждого мувсета каждого покемона считается PvP против каждого мувсета каждого другого покемона;",
            li2: "Предварительная обработка. Для каждого мувсета, каждого покемона вычисляется средний рейтинг против каждого мувсета каждого другого покемона. Каждому покемону присваивается основной мувсет (мувсет с наивысшим рейтингом);",
            li3: "Взвешивание мувов. Вычисляется взвешенный рейтинг для каждого мувсета каждого покемона против каждого ОСНОВНОГО мувсета каждого другого покемона. Мувсет с лучшим взвешенным рейтингом заменяет собой основной мувсет, выбранный на предыдущем этапе;",
            li4: "Взвешивание покемонов. Для каждого основного мувсета каждого покемона заново считается взвешенный рейтинг против каждого основного мувсета каждого другого покемона. По результатам этого взвешивания покемонам присваиваются номера в топе.",
        },


        move: "О лучших матчапах и контрах и лучших мувсетах",
        movep1: "После завершения работы алгоритма, покемонам присваиваются лучшие и худшие матчапы (контры) (до 10 штук). Для этого оппоненты каждого покемона сортируются по величине рейтинга. Из писка сначала выбираются покемоны имеющие вес в мете, а если таковых не осталось, то выбираются покемоны с наивысшим рейтингом против данного покемона. Таким образом список лучших/худших матчапов всегда будет содержать актуальную информацию (нет смысла добавлять в лучшие матчапы Venusaur Staryou, т.к. Staryou не играет в PvP, а вот добавлять туда Azumarill имеет смысл). Справа от имени покемона располается величина его среднего НЕ ВЗВЕШЕННОГО рейтинга.",
        movep2: "!!! Клик на худший/лучший матчап перенаправит вас на страницу PvP страницу данного матчапа, не закрывая при этом страницу рейтинга.",
        movep3: "В рейтинге для каждого покемона так же представлен список его лучших мувсетов (до 3 штук). Эти мувсеты расположены в порядке уменьшения взвешенного рейтинга, т.е. первым всегда будет мувсет с максимальным взвешенным рейтингом. Справа от названия мувсета распылается величина его среднего НЕ ВЗВЕШЕННОГО рейтинга.",
    }
}