export const locale = {
    en: {
        dexentr: "View dex for ",
        topcounters: "Find top counters against ",

        notfound: "Error 404 - Page not found",
        return: "Return to main page",
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
            initialStages: "\xa0\xa0\xa0Atk, Def\xa0\xa0",
            shields: "\xa0\xa0\xa0Shields\xa0\xa0\xa0",
            strategy: "\xa0\xa0Strategy\xa0\xa0",
            quickMove: "\xa0\xa0\xa0\xa0Quick\xa0\xa0\xa0\xa0\xa0",
            chargeMove: "\xa0\xa0\xa0Charge\xa0\xa0\xa0",
            type: "\xa0\xa0\xa0\xa0\xa0Type\xa0\xa0\xa0\xa0\xa0",
            savedparties: "\xa0\xa0\xa0Parties\xa0\xa0\xa0\xa0",

            league: "League",
            url: "\xa0\xa0\xa0\xa0PvP url\xa0\xa0\xa0\xa0",
            counter: "Pokemons",
            savegroupplaceholder: "Party name",
            latestnews: "Latest News",
            evolveTool: "Select pokemon you want to evolve",
            pvpoke: "Pvpoke-like rules",
            about: "About simulator",
            aboutrate: "About rating",
        },

        shinyrates: {
            searchplaceholder: "Search name",
            pokname: "Name",
            rate1: "Statis",
            rate2: "tics",
            rateest: "Rate",
            checks: "Sample",
            tip: "Estimated shiny rate based on the current sample size",
        },

        options: {
            moveSelect: {
                select: "Select...",
                none: "None",
            },
            league: {
                great: "Great (CP 1500)",
                ultra: "Ultra (CP 2500)",
                master: "Master (Unlimited)",
                premier: "Premier (Unlimited)",

            },
            strategy: {
                greedy: "Greedy",
                shieldSaving: "Shieldsaving",
            },
            type: {
                normal: "Normal",
                shadow: "Shadow",
            },
            matrixpreset: {
                great: "Great league meta",
                ultra: "Ultra league meta",
                master: "Master league meta",
            },
        },

        pageheaders: {
            pvprating: "PvP Rating  |  PogPvP.com",
            single: "Single PvP  |  PogPvP.com",
            common: "Raid simulator  |  PogPvP.com",
            matrix: "Matrix PvP  |  PogPvP.com",
            shiny: "Shiny Rates  |  PogPvP.com",
            evolution: "Evolution calc  |  PogPvP.com",
            raids: "Raids list  |  PogPvP.com",
            eggs: "Eggs list  |  PogPvP.com",
            main: "PogPvP.com | Pokemon GO PvP simulator, raid simulator, PvP ratings, current raids, pokedex, movedex, eggs list, shiny rates, and more",
        },

        pagedescriptions: {
            pvprating: "Pokemon GO PvP Rating. All Pokemon GO PvP matchups. Pokemon GO PvP counters by league",
            evolution: "Pokemon GO evolution calculator. Know your mon's CP after evolution in Pokemon GO",
            raids: "Pokemon GO raids list. Don't miss Pokemon GO raid tiers update",
            eggs: "Pokemon GO eggs list. Don't miss Pokemon GO eggs eggs pool update",
            common: "Pokemon GO raid simulator. Find the best counters to the current raid bosses in Pokemon GO",
            single: "Pokemon GO single PvP simulator. Pokemon GO PvP battle between two mons",
            matrix: "Pokemon GO matrix PvP simulator. Pokemon GO PvP battle between two or more mons. Pokemon GO PvP party advisor",
            shiny: "Pokemon GO shiny rates. Daily shiny rates updates, largest sample size",
            main: "Pokemon GO PvP simulator, Pokemon GO PvP ratings, Pokemon GO raid simulator, Pokemon GO PvP ratings, Pokemon GO current raids, Pokemon GO pokedex, Pokemon GO movedex, Pokemon GO eggs list, Pokemon GO shiny rates",
        },

        effStats: {
            atk: "Atk",
            atkTip: "Effective Atk",
            def: "Def",
            defTip: "Effective Def",
            sta: "Sta",
            staTip: "Effective Sta",
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

        stats: {
            lvl: "Lvl",
        },

        tips: {
            strategy: {
                greedy: "When greedy mode is on, pokemon uses shields whenever it results in higher battle rating",
                shieldSaving: "When shieldsaving mode is on, pokemon prioritizes shields number over battle rating if it doesn't lead him to guaranteed victory",
            },
            nameSearch: "Search name",
            url: {
                first: "Click inside the",
                second: "text field to copy",
                message: "Copied",
            },
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
            calculate: "Calculate",
            letsbattle: "Let's Battle",
            addpokemon: "Add pokemon",
            save: "Save",
            delete: "Delete",
            savegroup: "Save party",
            nextpage: "Recent news",
            prevpage: "Old news",
            loadmore: "Load more",
            home: "Main page",
            en: "English",
            ru: "Russian",
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
            attacker: "\xa0Attacker",
            defender: "Defender",
            newaction: "New action on turn ",
            default: "Default",
            alertchanges1st: "Your previous changes (turn ",
            alertchanges2nd: ") will be lost",
            alertmodified: "You have changed a Pokemon settings, constructor results can be unexpected. We suggest you to calculate new PvP and then enter constructor mode",
            submit: "Submit changes",
        },

        navbar: {
            single: "Single PvP",
            matrix: "Matrix PvP",
            shiny: "Sniny Rates",
            pvpTools: "PvP",
            pveTools: "PvE",
            raidsim: "Raid simulator",
            otherTools: "Other Tools",
            evo: "Evolution calc",
            raids: "Raids list",
            eggs: "Eggs list",
            pvprating: "PvP Rating",
            dex: "Dexes",
            movedex: "Movedex",
            pokedex: "Pokedex",
        },
        errors: {
            savegroup: "Empty field",
        },
        tierlist: {
            raidtier: "Tier",
            eggs: "Eggs",
            regionals: "Show regionals",
        },

        rating: {
            rate: "Rating",
            sheilds: "Shields",
            ratingType: "\xa0Rating type\xa0\xa0",
            type: "Type:",
            avgRate: "Average rating:",
            avgWin: "Average win rate:",
            score: "Score:",
            bestMatchups: "Best meta matchups ",
            bestCounter: "Meta counters",
            movesets: "Best movesets",
            firstsent: "PvP rating answers the question: who will be the best against the current meta.",
            secondsent: "Rating by divided by scenarios depending on the number of shields from each side.",
            thirdsent: "Overall rating shows the best average result across all scenarios.",
        },

    },




    ru: {
        dexentr: "Открыть декс для ",
        topcounters: "Найти лучших покемонов против ",

        notfound: "Ошибка 404 - Страница не найдена",
        return: "Вернуться на главную страницу",
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
            initialStats: "\xa0\xa0HP, Энерг.\xa0\xa0",
            initialStages: "\xa0\xa0\xa0Атк, защ\xa0\xa0\xa0\xa0",
            shields: "\xa0\xa0\xa0\xa0\xa0\xa0Щиты\xa0\xa0\xa0\xa0\xa0\xa0",
            strategy: "\xa0\xa0Стратегия\xa0\xa0    ",
            quickMove: "\xa0\xa0\xa0Быстрое\xa0\xa0\xa0\xa0",
            chargeMove: "Заряжаемое",
            type: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Тип\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            savedparties: "\xa0\xa0\xa0\xa0\xa0Группы\xa0\xa0\xa0\xa0\xa0",


            league: "\xa0\xa0\xa0Лига\xa0\xa0\xa0",
            url: "\xa0\xa0Ссылка\xa0\xa0",
            counter: "Покемонов",
            savegroupplaceholder: "Введите имя группы",
            latestnews: "Последние новости",
            evolveTool: "Выберите покемона для эволюции",
            pvpoke: "Правила Pvpoke",
            about: "О симуляторе",
            aboutrate: "О рейтинге",
        },

        shinyrates: {
            searchplaceholder: "Поиск по имени",
            pokname: "Имя",
            rate1: "Статис",
            rate2: "тика",
            rateest: "Шанс",
            checks: "Выборка",
            tip: "Оценочный шанс на шайни исходя из текущей выборки",

        },

        options: {
            moveSelect: {
                select: "Выбор...",
                none: "Нет",
            },
            league: {
                great: "Грейт (CP 1500)",
                ultra: "Ультра (CP 2500)",
                master: "Мастер (Не ограничена)",
                premier: "Премьер (Не ограничена)",
            },
            strategy: {
                greedy: "Жадная",
                shieldSaving: "С сохр. щитов",
            },
            type: {
                normal: "Обычный",
                shadow: "Теневой",
            },
            matrixpreset: {
                great: "Мета грейт лиги",
                ultra: "Мета ультра лиги",
                master: "Мета мастер лиги",
            },
        },

        pageheaders: {
            pvprating: "PvP рейтинг  |  PogPvP.com",
            single: "Одиночное PvP  |  PogPvP.com",
            common: "Симулятор рейдов  |  PogPvP.com",
            matrix: "Групповое PvP  |  PogPvP.com",
            shiny: "Шансы на шайни  |  PogPvP.com",
            evolution: "Калькулятор эволюций  |  PogPvP.com",
            raids: "Список текущих рейдов  |  PogPvP.com",
            eggs: "Список покемонов из яиц  |  PogPvP.com",
            main: "PogPvP.com | Pokemon GO PvP симулятор, Pokemon GO симулятор рейдов, Pokemon GO PvP рейтинг, Pokemon GO покедекс, Pokemon GO мувдекс, Pokemon GO список текущих рейлов, Pokemon GO список текущих покемонов из яиц, Pokemon GO шансы на шайни",

        },

        pagedescriptions: {
            pvprating: "PvP рейтинг пекемонов в Pokemon GO. Все PvP матчапы в Pokemon GO. Лучшие PvP контры в Pokemon GO",
            evolution: "Калькулятор эволюций в Pokemon GO. Знай CP своего покемона в Pokemon GO после эволюции!",
            raids: "Список текущих рейдов в Pokemon GO. Узнай об изменениях списка рейдов в Pokemon GO первым!",
            eggs: "Список покемонов из яиц в Pokemon GO. Узнай об изменениях списка яиц в Pokemon GO первым!",
            common: "Симулятор рейдов в Pokemon GO. Найди лучшего покемона против любого босса в Pokemon GO",

            single: "Симулятор одиночного PvP в Pokemon GO. Симулятор боев между двумя покемонами в Pokemon GO",
            matrix: "Симулятор группового PvP в Pokemon GO. Симулятор боев между двумя и более покемонами в Pokemon GO",
            shiny: "Шансы на шайни в Pokemon GO. Ежедневные обновления шансов на шайни, самая большая выборка",
            main: "Pokemon GO PvP симулятор, Pokemon GO симулятор рейдов, Pokemon GO PvP рейтинг, Pokemon GO покедекс, Pokemon GO мувдекс, Pokemon GO список текущих рейлов, Pokemon GO список текущих покемонов из яиц, Pokemon GO шансы на шайни",
        },

        effStats: {
            atk: "Атк",
            atkTip: "Эффективная Атк",
            def: "Защ",
            defTip: "Эффективная Защ",
            sta: "Здр",
            staTip: "Эффективное Здр",
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
        stats: {
            lvl: "Ур",
        },

        tips: {
            strategy: {
                greedy: "Когда жадный режим включен, покемон использует щиты каждый раз, когда это приводит к более высокому итоговому рейтингу",
                shieldSaving: "Когда включен режим сохранения щитов, покемон будет использовать щит только тогда, когда это приводит его к гарантированной победе",
            },
            nameSearch: "Поиск по имени",
            url: {
                first: "Кликните внутри,",
                second: "что бы скопировать",
                message: "Скопировано",
            },
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
            calculate: "Посчитать",
            letsbattle: "В бой!",
            addpokemon: "Добавить покемона",
            save: "Сохранить",
            delete: "Удалить",
            savegroup: "Сохранить группу",
            nextpage: "К новостям новее",
            prevpage: "К новостям старше",
            loadmore: "Загрузить еще",
            home: "Главная страница",
            en: "Английский",
            ru: "Русский",
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
            attacker: "\xa0\xa0\xa0\xa0\xa0Атакующий\xa0\xa0\xa0\xa0\xa0",
            defender: "Защищающийся",
            newaction: "Новое действие на ходу ",
            default: "По умолчанию",
            alertchanges1st: "Ваши изменения (ход ",
            alertchanges2nd: ") будут потеряны",
            alertmodified: "Вы изменили настройки одного из покемонов, результаты коструктура могут быть непредвиденными. Мы советуем Вам посчитать новое PvP и после войти в режим коснтруктора",
            submit: "Подтвердить изменения",
        },

        navbar: {
            single: "Одиночное PvP",
            matrix: "Групповое PvP",
            shiny: "Шансы на шайни",
            pvpTools: "PvP",
            pveTools: "PvE",
            raidsim: "Симулятор рейдов",
            otherTools: "Другое",
            evo: "Калькулятор эволюций",
            raids: "Список рейдов",
            eggs: "Покемоны из яиц",
            pvprating: "PvP рейтинг",
            dex: "Дексы",
            movedex: "Мувдекс",
            pokedex: "Покедекс",
        },
        errors: {
            savegroup: "Нет имени",
        },

        tierlist: {
            raidtier: "Уровень",
            eggs: "Яйца",
            regionals: "Показать регионалок",
        },

        rating: {
            rate: "Рейтинг",
            sheilds: "Щиты",
            ratingType: "Тип рейтинга",
            type: "Тип:",
            avgRate: "Средний рейтинг:",
            avgWin: "Средний процент побед:",
            score: "Счет:",
            bestMatchups: "Лучшие бои в мете",
            bestCounter: "Метовые контры",
            movesets: "Лучшие наборы умений",
            firstsent: "PvP рейтинг отвечает на вопрос: кто будет лучшим против текущей меты.",
            secondsent: "Рейтинг разделен по сценариям в зависимости от количества щитов скаждой стороны.",
            thirdsent: "Общий ретинг показывает лучший средний результат среди всех сценариев.",
        },
    }
}