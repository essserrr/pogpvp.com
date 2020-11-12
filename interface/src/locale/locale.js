export const locale = {
    en: {
        userPok: "User pokemon",
        allPok: "All pokemon",

        dexentr: "View dex for",

        oopsReg: "Oops... To use this function you need to sign up first",

        advisor: {
            adv: "Advisor",
            willow: "Hey Trainer, how about trying out these Pokémon?",
            bad: "Bad matchups",
            all: "All matchups",
            def: "Defensive typing",
            res: "Resistant to:",
            weak: "Weak to:",
            off: "Offensive typing",
            notcov: "Not covered:",
            strong: "Strong against:",
            tip: "Adviser shows a list of the most balanced parties that can be composed from the Pokemon of the left column. The option is active after calculating a matrix battle (when the number of pokemon in the left column is from 3 to 15). !!!The key settings change hides adviser.",

        },
        title: {
            selectMove: "Select a move:",
            initialStats: "HP, Energy",
            initialStages: "Atk, Def",
            shields: "Shields",
            strategy: "Strategy",
            quickMove: "Quick",
            chargeMove: "Charge",
            type: "Type",
            savedparties: "Parties",

            league: "League",
            counter: "Pokemons",
            savegroupplaceholder: "Party name",
            evolveTool: "Select pokemon you want to evolve",
            pvpoke: "Pvpoke-like rules",
            about: "About simulator",
        },

        pageheaders: {
            single: "Single PvP  |  PogPvP.com",
            common: "Raid simulator  |  PogPvP.com",
            matrix: "Matrix PvP  |  PogPvP.com",
            evolution: "Evolution calc  |  PogPvP.com",
        },

        pagedescriptions: {
            single: "Pokemon GO single PvP simulator. Pokemon GO PvP battle between two mons",
            matrix: "Pokemon GO matrix PvP simulator. Pokemon GO PvP battle between two or more mons. Pokemon GO PvP party advisor",
        },

        maximizer: {
            levelTitle: "Max level:",
            overall: "Overall",
            maximize: "Maximize",
            default: "Default",
        },
        initialStats: {
            tip: "Initial HP and energy for selected pokemon; if HP equals zero, PvP starts from full HP",
            hpTip: "Max",
            energyTip: "Energy",
            energy: "En",
        },

        tips: {
            impExp: "Enter or copy your Pokemon",
            strategy: {
                greedy: "When greedy mode is on, pokemon uses shields whenever it results in higher battle rating",
                shieldSaving: "When shieldsaving mode is on, pokemon prioritizes shields number over battle rating if it doesn't lead him to guaranteed victory",
            },
            nameSearch: "Search name",

            savegroup: "Enter a party name (1-15 charaters)",
            matrixPanel: "Default settings",
            loading: "Loading...",
            evolveTool: "Next evolution",
            shadow: "Shadow pokemons have \n x1.2 Atk and x0.881 Def",
            constructor: "Allows to chage actions in the timeline",
            pvpoke: "Enables Pvpoke-like PvP rules; after enabling strategies don't affect PvP results",
            triple: "Overall rating",
            tripletip: "Calculates PvP between every single pokemon of the right column and every single  pokemon of the left column. Calculation is performed with following shield combinations: 0x0, 1x1, 2x2. After that estimates overall rating of every fight.\n When the option is active, changing the number of shields does not affect the result.",
            stages: "Attack and defence stages to start PvP with",
            saved: "List of all saved parties",
            quick: "Quick move",
            charge: "Charge move",
        },
        move: {
            damage: "Damage: ",
            energy: "Energy cost: ",
            probability: "Probability: ",
            target: "Target: ",
            stat: "Stat: ",
            stage: "Stage: ",
        },

        buttons: {
            byrating: "Sort by rating",
            byzeros: "Sort by bad matchups",

            copy: "Copy",

            impExp: "Import/Export",

            calculate: "Calculate",
            letsbattle: "Let's Battle",
            addpokemon: "Add pokemon",
            save: "Save",
            delete: "Delete",
            savegroup: "Save party",
            loadmore: "Load more",
            submitchange: "Submit changes",
        },

        resultTable: {
            rate: "Battle Rating",
            hpRes: "Total HP / HP remained",
            damageRes: "Damage taken / Damage blocked",
            energyRes: "Energy gained / Energy used",
        },

        reconstruction: {
            turn: "Turn: ",
            faint: "Faint",
            damage: "Damage: ",
            energy: "Energy: ",
            idle: "Idle",
            aStage: "Atk stage: ",
            dStage: "Def stage: ",
            self: "Target: self",
            opponent: "Target: opponent",
            shield: "Shield",
            contructor: "Constructor mode",
        },

        constructor: {
            useshield: "Use shield",
            trigger: "Trigger effect",
            attacker: "Attacker",
            defender: "Defender",
            newaction: "New action on turn ",
            default: "Default",
            alertchanges1st: "Your previous changes (turn ",
            alertchanges2nd: ") will be lost",
            alertmodified: "You have changed a Pokemon settings, constructor results can be unexpected. We suggest you to calculate new PvP and then enter constructor mode",
            submit: "Submit changes",
        },

        errors: {
            savegroup: "Empty field",
        },
    },




    ru: {
        userPok: "Покемоны пользователя",
        allPok: "Все покемоны",

        dexentr: "Открыть декс для",

        oopsReg: "Ой... Что бы воспользоваться этой функцией, вы должны сначала зарегистрироваться",

        advisor: {
            adv: "Советчик",
            willow: "Эй, Тренер, как на счет того, что бы попробовать этих покемонов?",
            bad: "Плохие матчи",
            all: "Все матчи",
            def: "В защите",
            res: "Сопротивляются:",
            weak: "Слабы к:",
            off: "В атаке",
            notcov: "Не эффективны против:",
            strong: "Сильны против:",
            tip: "При нажатии показывает список наиболее сбалансированных групп, которые можно собрать из покемонов левого столбца. Опция активна после вычисления групповой битвы (когда число покемонов в левой колонке составляет от 3 до 15). !!!Изменение ключевых настроек вновь скрывает советчик.",
        },
        title: {
            selectMove: "Выберите умение:",
            initialStats: "HP, Энерг.",
            initialStages: "Атк, защ",
            shields: "Щиты",
            strategy: "Стратегия    ",
            quickMove: "Быстрое",
            chargeMove: "Заряжаемое",
            type: "Тип",
            savedparties: "Группы",


            league: "Лига",
            counter: "Покемонов",
            savegroupplaceholder: "Введите имя группы",
            evolveTool: "Выберите покемона для эволюции",
            pvpoke: "Правила Pvpoke",
            about: "О симуляторе",
        },

        pageheaders: {
            single: "Одиночное PvP  |  PogPvP.com",
            common: "Симулятор рейдов  |  PogPvP.com",
            matrix: "Групповое PvP  |  PogPvP.com",
            evolution: "Калькулятор эволюций  |  PogPvP.com",
        },

        pagedescriptions: {
            single: "Симулятор одиночного PvP в Pokemon GO. Симулятор боев между двумя покемонами в Pokemon GO",
            matrix: "Симулятор группового PvP в Pokemon GO. Симулятор боев между двумя и более покемонами в Pokemon GO",
        },

        maximizer: {
            levelTitle: "Макс. ур.:",
            overall: "Общий",
            maximize: "Максимум",
            default: "Обычный",

        },

        initialStats: {
            tip: "Начальные HP и энергия для выбранного покемона; Если HP равняется 0, то PvP начнется с полным запасом HP",
            hpTip: "Макс",
            energyTip: "Энергия",
            energy: "Эн",
        },

        tips: {
            impExp: "Введите или скопируйте ваших покемонов",
            strategy: {
                greedy: "Когда жадный режим включен, покемон использует щиты каждый раз, когда это приводит к более высокому итоговому рейтингу",
                shieldSaving: "Когда включен режим сохранения щитов, покемон будет использовать щит только тогда, когда это приводит его к гарантированной победе",
            },
            nameSearch: "Поиск по имени",

            stages: "Стадии атаки и защиты, с которыми начнется PvP",
            savegroup: "Введите имя группы (1-15 символов)",
            matrixPanel: "Настройки по умолчанию",
            loading: "Загрузка...",
            evolveTool: "Следующая эволюция",
            shadow: "У теневых покемонов \n x1.2 Атк и x0.881 Защ",
            constructor: "Позволяет менять дейсвия на графике",
            pvpoke: "Включает правила PvP подобные Pvpoke. Когда режим активен, стратегии перестают работать",
            triple: "Общий рейтинг",
            tripletip: "Проводит PvP между каждым покемоном левого столбца и каждым покемоном правого столбца. Расчет проводится для 3 комбинаций щитов: 0х0, 1х1, 2х2, после чего определяется общий рейтинг.\n Когда опция активна, изменение количества щитов в опцих не влияет на результат.",
            saved: "Список всех сохраненных групп",
            quick: "Быстрое умение",
            charge: "Заряжаемое умение",
        },
        move: {
            damage: "Урон: ",
            energy: "Энергия: ",
            probability: "Шанс: ",
            target: "Цель: ",
            stat: "Параметр: ",
            stage: "Модификатор: ",
        },
        buttons: {
            byrating: "Сортировать по рейтингу",
            byzeros: "Сортировать по уязвимостям",
            copy: "Скопировать",

            impExp: "Импорт/Экспорт",

            calculate: "Посчитать",
            letsbattle: "В бой!",
            addpokemon: "Добавить покемона",
            save: "Сохранить",
            delete: "Удалить",
            savegroup: "Сохранить группу",
            loadmore: "Загрузить еще",
            submitchange: "Подвердить изменения",
        },

        resultTable: {
            rate: "Боевой рейтинг",
            hpRes: "Общее HP / HP осталось",
            damageRes: "Урона получено / Урона блокировано",
            energyRes: "Энергии получено / Энергии использовано",
        },

        reconstruction: {
            turn: "Ход: ",
            faint: "Поражение",
            damage: "Урон: ",
            energy: "Энергия: ",
            idle: "Ожидание",
            aStage: "Атк модификатор: ",
            dStage: "Деф модификатор: ",
            self: "Цель: на себя",
            opponent: "Цель: противник",
            shield: "Щит",
            contructor: "Режим конструктора",
        },

        constructor: {
            useshield: "Использовать щит",
            trigger: "Эффект сработает",
            attacker: "Атакующий",
            defender: "Защищающийся",
            newaction: "Новое действие на ходу ",
            default: "По умолчанию",
            alertchanges1st: "Ваши изменения (ход ",
            alertchanges2nd: ") будут потеряны",
            alertmodified: "Вы изменили настройки одного из покемонов, результаты коструктура могут быть непредвиденными. Мы советуем Вам посчитать новое PvP и после войти в режим коснтруктора",
            submit: "Подтвердить изменения",
        },

        errors: {
            savegroup: "Нет имени",
        },
    }
}