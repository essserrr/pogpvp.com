export const userLocale = {
    en: {
        err: {
            token: "You must check the captcha",
            ness: "Necessary field",
            match: "Passwords don't match",
            symb: " contains prohibited symbols",
            symb2: " contain prohibited symbols",

            emailf: "Incorrect Email format",
            lesseq: {
                l1: " must be less than or equal ",
                l2: " must be less than or equal ",
                l3: " must be less than or equal ",
                c: " characters",
            },
            longer: {
                l1: " must be longer than ",
                l2: " must be longer than ",
                l3: " must be longer than ",
            },
        },
        pageheaders: {
            reg: "User sign up form  |  PogPvP.com",

            log: "Log in form  |  PogPvP.com",

            usr: "User page  |  PogPvP.com",
            usrinfo: "User page: User info  |  PogPvP.com",
            usrsec: "User page: Security  |  PogPvP.com",
            usrmoves: "User page: User's moves  |  PogPvP.com",
            usrbroker: "User page: Shiny broker  |  PogPvP.com",
            usrpok: "User page: User pokemon  |  PogPvP.com",

            broker: "Shiny broker  |  PogPvP.com",
        },
        pagedescriptions: {
            reg: "User sign up form",
            usr: "User page",
            log: "Log in form",

            broker: "Shiny broker: helps you to trade your shiny pokemon in Pokemon go",
        },
        moveconstr: {
            success: "Moves successfully changed",
            add: "Add move",
            changes: "Save changes",
            umoves: "User moves",
            constr: "Move constructor",
            err: {
                wrong: "Wrong fromat of ",
                larzero: " must be larger than zero",
                larzerofem: " must be larger than zero",
                integr: "  must be an integral value",
                integrfem: "  must be an integral value",
                neg: " must be negative",
                pos: " must be postive",
                poszer: " must be positive or zero",
                allowed: "Allowed energy value is from -100 to 100",
                damageallowed: "Damage must be less than 65000",
                cdallowed: "Cooldown must be less than 60 seconds",
                sumwind: "Cooldown must be larger than Damage window + Dodge window",
                hundred: "Probability cannont be more than 100%",

                d1: "damage",
                d2: "Damage",

                e1: "energy",
                e2: "Energy",

                cd1: "cooldown",
                cd2: "Cooldown",

                pr1: "probability",
                pr2: "Probability",

                mt1: "Move title",
                mt2: "move title",
            },
            title: "\xa0\xa0\xa0\xa0\xa0\xa0Move title\xa0\xa0\xa0\xa0\xa0\xa0",
            category: "\xa0\xa0Move category\xa0",
            type: "\xa0\xa0\xa0\xa0\xa0Move type\xa0\xa0\xa0\xa0\xa0\xa0",
            catopt: {
                q: "Quick move",
                ch: "Charge move",
            },
            statopt: {
                n: "None",
                a: "Atk",
                d: "Def",
                ad: "Atk + Def",
            },
            subjopt: {
                n: "None",
                s: "Self",
                o: "Opponent",
            },
            pve: {
                title: "PvE stats",
                d: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0Damage\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                e: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Energy\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                cd: "\xa0\xa0\xa0\xa0\xa0\xa0Cooldown\xa0\xa0\xa0\xa0\xa0\xa0",
                dmgwd: "Damage window",
                dwd: "\xa0\xa0Dodge window\xa0\xa0",
                tips: {
                    d: "Damage must be a positive integral number or zero",
                    e: "Energy must be a positive (for quick moves) / negative (for charge moves) integral number or zero. Cannot exceed 100 points",
                    cd: "Cooldown duration in seconds. Must be a postive number",
                    dmgwd: "Damage window (seconds) is a moment when the damge window starts. (Damage window + Dodge window) must be less then (Cooldown). Damage window must be a postive number",
                    dwd: "Dodge window duration in seconds. Damage window + Dodge window must be less then Cooldown. Dodge window must be a postive number",
                },
            },
            pvp: {
                title: "PvP stats",
                d: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0Damage\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                e: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Energy\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                cd: "\xa0\xa0\xa0\xa0\xa0\xa0Cooldown\xa0\xa0\xa0\xa0\xa0\xa0",
                prob: "\xa0\xa0\xa0\xa0\xa0\xa0Probability\xa0\xa0\xa0\xa0\xa0",
                stat: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Stat\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                stage: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Stage\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                subj: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Subject\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                tips: {
                    d: "Damage must be a positive integral number or zero",
                    e: "Energy must be a positive (for quick moves) / negative (for charge moves) integral number or zero. Cannot exceed 100 points",
                    cd: "Cooldown duration in rounds",
                    prob: "Probability to activate effect of a move",
                    stat: "Stats to change after activation",
                    stage: "Number of stages",
                    subj: "Subject of effect",
                },
            },
        },

    },

    ru: {
        err: {
            token: "Вы должны пройти проверку",
            ness: "Обязательное поле",
            match: "Пароли не совпадают",
            symb: " содержит запрещенные символы",
            symb2: " содержат запрещенные символы",

            emailf: "Неверный формат адреса электронной почты",
            lesseq: {
                l1: " должно быть меньше либо равно ",
                l2: " должен быть меньше либо равен ",
                l3: " должны быть меньше либо равны ",
                c: " символов",
            },
            longer: {
                l1: " должно быть длиннее, чем ",
                l2: " должен быть длиннее, чем ",
                l3: " должны быть длиннее, чем ",
            },
        },
        pageheaders: {
            reg: "Форма регистрации пользователя  |  PogPvP.com",
            log: "Форма входа  |  PogPvP.com",

            usr: "Страница пользователя  |  PogPvP.com",
            usrinfo: "Страница пользователя: Информация о пользователе  |  PogPvP.com",
            usrsec: "Страница пользователя: Безопасность  |  PogPvP.com",
            usrmoves: "Страница пользователя: Умения пользователя  |  PogPvP.com",
            usrbroker: "Страница пользователя: Шайни брокер  |  PogPvP.com",
            usrpok: "Страница пользователя: Покемоны пользователя  |  PogPvP.com",

            broker: "Шайни брокер  |  PogPvP.com",
        },
        pagedescriptions: {
            reg: "Форма регистрации пользователя",
            usr: "Страница пользователя",
            log: "Форма входа",

            broker: "Шайни брокер: помощь в поиске шайни для обмена в Pokemon go",
        },
        moveconstr: {
            success: "Умения успешно сохранены",
            add: "Добавить умение",
            changes: "Сохранить изменения",
            umoves: "Умения пользователя",
            constr: "Конструктор умений",
            err: {

                wrong: "Неверный формат ",
                larzero: " должен быть больше нуля",
                larzerofem: " должна быть больше нуля",
                integr: "  должен быть целым числом",
                integrfem: "  должна быть целым числом",
                neg: " должна быть отрицательной",
                pos: " должна быть положительной",
                poszer: " должна быть положительной или нулем",
                allowed: "Энергия должна быть от -100 до 100",
                damageallowed: "Урон должен быть меньше, чем 65000",
                cdallowed: "Перезарядка должна быть меньше, чем 60 секунд",
                sumwind: "Перезарядка должна быть больше, чем (Окно урона + Окно уклонения)",
                hundred: "Вероятность не может быть больше 100%",

                d1: "урона",
                d2: "Урон",

                e1: "энергии",
                e2: "Энергия",

                cd1: "перезарядки",
                cd2: "Перезарядка",

                pr1: "вероятности",
                pr2: "Вероятность",

                mt1: "Название умения",
                mt2: "названия умения",
            },
            title: "Название умения",
            category: "\xa0\xa0\xa0\xa0\xa0Категория\xa0\xa0\xa0\xa0\xa0",
            type: "\xa0\xa0\xa0\xa0Тип умения\xa0\xa0\xa0\xa0",
            catopt: {
                q: "Быстрое умение",
                ch: "Заряжаемое умение",
            },
            statopt: {
                n: "Нет",
                a: "Атк",
                d: "Защ",
                ad: "Атк + Защ",
            },
            subjopt: {
                n: "Нет",
                s: "На себя",
                o: "На противника",
            },
            pve: {
                title: "Параметры в PvE",
                d: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Урон\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                e: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0Энергия\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                cd: "\xa0\xa0\xa0Перезарядка\xa0\xa0\xa0",
                dmgwd: "\xa0\xa0\xa0\xa0Окно урона\xa0\xa0\xa0\xa0\xa0",
                dwd: "Окно уклонения",
                tips: {
                    d: "Урон должен быть равен целому положительному числому или нулю",
                    e: "Энергия должна быть равно целому положительному (для быстрых умений) / отрицательному (для заряжаемых умений) числу или нулю. Не может превышать 100 единиц",
                    cd: "Продолжительность перезарядки в секундах. Должна быть положительным числом.",
                    dmgwd: "Окно урона (в секундах) - это оммент, когда окно урона начинается. (Окно урона + Окно уклонения) должно быть меньше, чем (Перезарядка). Окно урона должно быть положительным числом",
                    dwd: "Длительность укна уклонения в секундах. (Окно урона + Окно уклонения) должно быть меньше, чем (Перезарядка). Окно уклонения должно быть положительным числом",
                },
            },
            pvp: {
                title: "Параметры в PvP",
                d: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Урон\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                e: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0Энергия\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                cd: "\xa0\xa0\xa0Перезарядка\xa0\xa0\xa0",
                prob: "\xa0\xa0\xa0Вероятность\xa0\xa0\xa0",
                stat: "\xa0\xa0\xa0\xa0\xa0\xa0Параметр\xa0\xa0\xa0\xa0\xa0",
                stage: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Стадия\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                subj: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Цель\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
                tips: {
                    d: "Урон должен быть равен целому положительному числому или нулю",
                    e: "Энергия должна быть равно целому положительному (для быстрых умений) / отрицательному (для заряжаемых умений) числу или нулю. Не может превышать 100 единиц",
                    cd: "Продолжительность перезарядки в раундах.",
                    prob: "Вероятность активировать эффект умения",
                    stat: "Параметры, которые изменятся после активации",
                    stage: "Количество стадий",
                    subj: "Цель, на которую накладывается эффект",
                },
            },
        },
    }
}