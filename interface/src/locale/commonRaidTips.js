export const commonRaidTips = {
    en: {
        par1: `The raid simulator creates a list of the best pokemon against the selected boss.`,

        legend: "Legend (hover over a cell to get a tip)",

        indat: "Initial data",
        indatp1: "Attacker’s required initial data: Level, Attack, Defense, Stamina, Pokemon Type. Attacker's name, quick and charge move are optional parameters. If any of the optional parameters is not specified, then the calculation is made for all possible values of this parameter (for example, if an attacker’s name is not specified, then the calculation will be made for all possible pokemon).",
        indatp2: "All raid settings are required, however, they all have a default value.",
        indatp3: "A name, raid tier and mode are required for a boss. Optional: quick and charge move.",

        plnumb: "Players number",
        plnumbp1: "Each player, inflicting damage to a boss, gives him energy equal to ceil(damage/2). Thus, the more players, the more energy a boss will get, the more often he will use his charge move.",

        dodge: "Dodge chance",
        dodgep1: "Dodge chance represents the likelihood to dodge the next charge attack of a boss. If a pokemon successfully dodged, then incoming damage is reduced by 75%. It is worth noting that the simulator performs almost perfect dodges, i.e. Pokemon almost does not lose any additional time to dodge. This behavior is comparable to the actions of an experienced player with a good ping.",

        agr: "Aggression mode",
        agrp1: "When aggression mode is on, the player always gets damage from the next boss attack after changing a group of Pokemon/Pokemon (if this attack can be made). This behavior simulates the worst-case scenario, when, changing, for example, a group, you receive damage from the boss after logging into the battle.",

        solv: "About solver",
        solvp1: "The solver creates a list of all possible movesets and for each of them conducts several simulations. The results of these simulations are averaged for each moveset of a boss, after which the result appears on the screen.",
        solvp2: "The following restrictions are applied to the number of simulations per moveset:",

        solvli1: "If an attacker’s name is not specified - 10 simulations on the boss moveset;",
        solvli2: "If an attacker’s name is specified - 100 simulations on the boss moveset;",
        solvli3: "If attacker's name, fast and charge move are not specified - 500 simulations per moveset;",
        solvli4: "Recalculate with high precision - 500 simulations per moveset.",

        break: "Breakpoints calculator",
        breakp1: "The breakpoints calculator answers the question of how much the damage of the pokemon moves will increase when the conditions affecting the damage (attack, level, etc.) change. It also shows how much it will cost to increase the level to the selected one.",

        feat: "Features",
        featp1: "The simulator is able to work correctly with Hidden Power, as well as with Mew as a boss. Sorting by DPS/damage does not require recalculation of the simulation.",

        damage: "Damage",
        time: "Time left",
        fainted: "Pokemon fainted",

    },
    ru: {
        par1: `Рейдовый симулятор создает список лучших покемонов против выбранного босса.`,

        legend: "Условные обозначения (наведите мышь на ячейку, что бы получить подсказку)",

        indat: "Начальные данные",
        indatp1: "Необходимые данными для атакующего: Уровень, Атака, Защита, Здоровье, Тип покемона. Имя атакующего, быстрое и заряжаемое умение атакующего являются опциональными параметрами. Если какой-то из опциональных параметров не указан, то расчёт производится для всех возможных значений этого параметра (например, если не указано имя атакующего, то расчёт будет произведен для всех возможных покемонов).",
        indatp2: "Все настройки рейда являются обязательными, однако, все они имеют значение по-умолчанию.",
        indatp3: "Для босса обязательными являются: имя босса, уровень рейда и режим агрессии. Опциональные: быстрое и заряжаемое умение босса.",

        plnumb: "Число игроков",
        plnumbp1: "Каждый игрок, нанося урон боссу, дает ему энергию, равную ceil(урон / 2). Таким образом, чем больше игроков, тем больше энергии будет у босса, тем чаще он будет использовать заряжаемое умение.",

        dodge: "Шанс на уклонение",
        dodgep1: "Представляет собой вероятность успешного уклонения от заряжаемой атаки босса. При успешном уклонении урон по покемону уменьшается на 75%. Стоит заметить, симулятор проводит почти идеальные уклонения, т.е. покемон почти не теряет лишнего времени для того, чтобы увернуться. Данное поведение сопоставимо с действиями опытного игрока с хорошим пигом.",

        agr: "Режим агрессии",
        agrp1: "В агрессивном режиме игрок всегда попадает под следующую атаку босса после смены группы/покемона (если эта атака может быть совершена). Такое поведение имитирует наихудший вариант развития событий, когда вы, поменяв, например, группу, сразу же получаете урон от босса.",

        solv: "О решателе",
        solvp1: "Решатель создает список всех возможных мувсетов и для каждого из них проводит несколько симуляций. Результаты этих симуляций усредняются для каждого мувсета босса, после чего результат появляется на экране.",
        solvp2: "Следующие ограничения действуют для количества симуляций на мувсет:",

        solvli1: "Если имя атакующего не задано – 10 симуляций на мувсет босса;",
        solvli2: "Если имя атакующего задано – 100 симуляций на мувсет босса;",
        solvli3: "Если заданы имя, быстрое и заряжаемое умение атакующего – 500 симуляций на мувсет;",
        solvli4: "Пересчитать с высокой точностью – 500 симуляций на мувсет.",

        break: "Вычисление брейкпоинтов",
        breakp1: "Калькулятор брейпоитов отвечает на вопрос, на сколько вырастет урон умений покемона при изменении условий, влияющих на урон (атака, уровень и тд). Так же он показывает сколько будет стоить увеличениt уровня до выбранного.",

        feat: "Особенности",
        featp1: "Симулятор умеет правильно работать с умением Hidden Power, а также со Mew в качестве босса. Сортировка по DPS/урону не требует пересчета симуляции.",

        damage: "Нанесенный урон",
        time: "Времени осталось",
        fainted: "Покемонов погибло",
    }
}