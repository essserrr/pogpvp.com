export const userLocale = {
    en: {
        pageheaders: {
            usrmoves: "User page: User moves  |  PogPvP.com",
        },
        pagedescriptions: {
            usr: "User page",
        },
        moveconstr: {
            success: "Moves have been successfully saved",
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
            title: "Move title",
            category: "Move category",
            type: "Move type",
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
                d: "Damage",
                e: "Energy",
                cd: "Cooldown",
                dmgwd: "Damage window",
                dwd: "Dodge window",
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
                d: "Damage",
                e: "Energy",
                cd: "Cooldown",
                prob: "Probability",
                stat: "Stat",
                stage: "Stage",
                subj: "Subject",
                tips: {
                    d: "Damage must be a positive integral number or zero",
                    e: "Energy must be a positive (for quick moves) / negative (for charge moves) integral number or zero. Cannot exceed 100 points",
                    cd: "Cooldown duration in rounds",
                    prob: "Probability to activate effect of a move in percents",
                    stat: "Stats to change after activation",
                    stage: "Number of stages",
                    subj: "Subject of effect",
                },
            },
        },

    },

    ru: {
        pageheaders: {
            usrmoves: "Страница пользователя: Умения пользователя  |  PogPvP.com",
        },
        pagedescriptions: {
            usr: "Страница пользователя",
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
            category: "Категория",
            type: "Тип умения",
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
                d: "Урон",
                e: "Энергия",
                cd: "Перезарядка",
                dmgwd: "Окно урона",
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
                d: "Урон",
                e: "Энергия",
                cd: "Перезарядка",
                prob: "Вероятность",
                stat: "Параметр",
                stage: "Стадия",
                subj: "Цель",
                tips: {
                    d: "Урон должен быть равен целому положительному числому или нулю",
                    e: "Энергия должна быть равно целому положительному (для быстрых умений) / отрицательному (для заряжаемых умений) числу или нулю. Не может превышать 100 единиц",
                    cd: "Продолжительность перезарядки в раундах.",
                    prob: "Вероятность активировать эффект умения в процентах",
                    stat: "Параметры, которые изменятся после активации",
                    stage: "Количество стадий",
                    subj: "Цель, на которую накладывается эффект",
                },
            },
        },
    }
}