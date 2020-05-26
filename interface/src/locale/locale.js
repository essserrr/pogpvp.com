export const locale = {
    en: {
        title: {
            selectMove: "Select a move:",
            initialStats: "Initial HP, Energy",
            initialStages: "\xa0Atk, Def Stages\xa0",
            shields: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Shields\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            strategy: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0Strategy\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            quickMove: "\xa0\xa0\xa0\xa0Quick Move\xa0\xa0\xa0\xa0",
            chargeMove: "\xa0\xa0Charge Move\xa0\xa0\xa0",
            league: "League",
            url: "\xa0\xa0\xa0\xa0PvP url\xa0\xa0\xa0\xa0",
            savedparties: "\xa0\xa0\xa0Saved parties\xa0\xa0",
            counter: "Pokemons",
            savegroupplaceholder: "Party name",
            latestnews: "Latest News",
            type: "\xa0Pokemon Type\xa0",
            evolveTool: "Select pokemon you want to evolve",
            pvpoke: "Pvpoke-like rules",
        },

        shinyrates: {
            searchplaceholder: "Search name",
            pokname: "Name",
            rate: "Statistics",
            rateest: "Rate",
            checks: "Sample"
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
            pvprating: "PvP Rating",
            single: "Single PvP",
            matrix: "Matrix PvP",
            shiny: "Shiny Rates",
            evolution: "Evolution calc",
            raids: "Raids list",
            eggs: "Eggs list",
            main: "PogPvP.com | Pokemon GO PvP simulator, ratings, shiny rates and more",
        },

        pagedescriptions: {
            pvprating: "Pokemon GO PvP Rating, top matchups and counters by league",


            evolution: "Pokemon GO evolution calculator. Know your mon's CP after evolution",
            raids: "Pokemon GO raids list. Don't miss raid tiers update",
            eggs: "Pokemon GO eggs list. Don't miss eggs pool update",

            single: "Pokemon GO single PvP simulator. Battle between two mons",
            matrix: "Pokemon GO matrix PvP simulator. Battle between two or more mons",

            shiny: "Pokemon GO shiny rates. Daily updates, largest sample size",
            main: "Pokemon GO PvP simulator, PvP ratings, shiny rates and more",
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
            matrixPanel: "Default settings:",
            loading: "Loading...",
            evolveTool: "Next evolution",
            shadow: "Shadow pokemons have \n x1.2 Atk and x0.881 Def",
            constructor: "Allows to chage actions in the timeline",
            pvpoke: "Enables Pvpoke-like PvP rules; after enabling strategies don't affect PvP results",
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
            letsbattle: "Let's Battle",
            addpokemon: "Add pokemon",
            save: "Save",
            delete: "Delete",
            savegroup: "Save party",
            nextpage: "Next page",
            prevpage: "Previous page",
            loadmore: "Load more",
            home: "Main page",
            en: "English",
            ru: "Russian",
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
            newaction: "Select new action on turn ",
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
            pvpTools: "PvP Tools",
            otherTools: "Other Tools",
            evo: "Evolution calc",
            raids: "Raids list",
            eggs: "Eggs list",
            pvprating: "PvP Rating",
        },
        errors: {
            savegroup: "Empty field",
        },
        tierlist: {
            raidtier: "Level",
            boosted: "Boosted CP:\xa0",
            eggs: "Eggs",
            regionals: "Show regionals",
        },

        rating: {
            sheilds: "Shields",
            ratingType: "Rating type",
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
        title: {
            selectMove: "Выберите умение:",
            initialStats: "Нач HP, энергия",
            initialStages: "Модиф атк, защ",
            shields: "\xa0\xa0Число щитов\xa0\xa0\xa0",
            strategy: "\xa0\xa0\xa0\xa0\xa0Стратегия\xa0\xa0\xa0\xa0\xa0\xa0",
            quickMove: "\xa0Быстр. умение\xa0",
            chargeMove: "\xa0Заряж. умение\xa0",
            league: "\xa0\xa0\xa0Лига\xa0\xa0\xa0",
            url: "\xa0\xa0Ссылка\xa0\xa0",
            savedparties: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Группы\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            counter: "Покемонов",
            savegroupplaceholder: "Введите имя группы",
            latestnews: "Последние новости",
            type: "\xa0\xa0Тип покемона\xa0",
            evolveTool: "Выберите покемона для эволюции",
            pvpoke: "Правила боев Pvpoke",
        },

        shinyrates: {
            searchplaceholder: "Поиск по имени",
            pokname: "Имя",
            rate: "Статистика",
            rateest: "Шанс",
            checks: "Выборка"
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
            pvprating: "PvP рейтинг",
            single: "Одиночное PvP",
            matrix: "Групповое PvP",
            shiny: "Шансы на шайни",
            evolution: "Калькулятор эволюций",
            raids: "Список текущих рейдов",
            eggs: "Список покемонов из яиц",
            main: "PogPvP.com | Pokemon GO PvP симулятор, рейтинг, шансы на шайни и многое другое",
        },

        pagedescriptions: {
            pvprating: "PvP рейтинг пекемонов в Pokemon GO, лучшие матчапы и контры",
            evolution: "Калькулятор эволюций в Pokemon GO. Знай CP своего покемона после эволюции!",
            raids: "Список текущих рейдов в Pokemon GO. Узнай об изменениях списка рейдов первым!",
            eggs: "Список покемонов из яиц в Pokemon GO. Узнай об изменениях списка яиц первым!",

            single: "Симулятор одиночного PvP в Pokemon GO. Бой между двумя покемонами",
            matrix: "Симулятор группового PvP  в Pokemon GO. Бой между двумя и более покемонами",
            shiny: "Шансы на шайни в Pokemon GO. Ежедневные обновления, самая большая выборка",
            main: "Pokemon GO PvP симулятор, PvP рейтинг, шансы на шайни и многое другое",
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
            savegroup: "Ввведите имя группы (1-15 символов)",
            matrixPanel: "Настройки по умолчанию:",
            loading: "Загрузка...",
            evolveTool: "Следующая эволюция",
            shadow: "У теневых покемонов \n x1.2 Атк и x0.881 Защ",
            constructor: "Позволяет менять дейсвия на графике",
            pvpoke: "Включает правила PvP, подобные Pvpoke. Когда режим активен, стратегии перестают работать",
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
            letsbattle: "В бой!",
            addpokemon: "Добавить покемона",
            save: "Сохранить",
            delete: "Удалить",
            savegroup: "Сохранить группу",
            nextpage: "Следующая страница",
            prevpage: "Предыдущая страница",
            loadmore: "Загрузить еще",
            home: "Главная страница",
            en: "Английский",
            ru: "Русский",
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
            newaction: "Выберите новое действие на ходу ",
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
            pvpTools: "PvP функции",
            otherTools: "Другое",
            evo: "Калькулятор эволюций",
            raids: "Список рейдов",
            eggs: "Покемоны из яиц",
            pvprating: "PvP рейтинг",
        },
        errors: {
            savegroup: "Нет имени",
        },

        tierlist: {
            raidtier: "Уровень",
            boosted: "CP с бустом:\xa0",
            eggs: "Яйца",
            regionals: "Показать регионалок",
        },

        rating: {
            sheilds: "Щиты",
            ratingType: "Тип рейтинга",
            type: "Тип:",
            avgRate: "Средний рейтинг:",
            avgWin: "Средний процент побед:",
            score: "Счет:",
            bestMatchups: "Лучшие бои в мете",
            bestCounter: "Лучшие контры в мете",
            movesets: "Лучшие наборы умений",
            firstsent: "PvP рейтинг отвечает на вопрос: кто будет лучшим против текущей меты.",
            secondsent: "Рейтинг разделен по сценариям в зависимости от количества щитов скаждой стороны.",
            thirdsent: "Общий ретинг показывает лучший средний результат среди всех сценариев.",
        },
    }
}