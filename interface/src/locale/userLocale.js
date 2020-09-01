export const userLocale = {
    en: {
        impExp: "Import/Export",

        soon: "This feature will be implemented soon, please come back and check later",
        loading: "Loading...",
        propc: "By signing up you agree with ",
        and: "and",
        pol: {
            t: "Terms and Conditions",
            p: "Privacy Policy",
        },

        userpok: {
            poktitle: "User pokemon",
            addpok: "Add pokemon",
            or: "OR",

            err: {
                errname: "You must select a pokemon",
                errq: "You must select a quick move",
                errch: "You must select a charge move",
            },
        },

        signup: {
            newlin: "Have an account?",
            reg: "Sign up",
            toreg: "Sign up",
            uname: "Username",
            pass: "Password",
            cpass: "Confirm password",
            email: "Email",
        },
        signin: {
            forg: "Forgot your password?",
            rest: "Restore",
            newsup: "Don't have an account?",
            log: "Log in",
            tolog: "Log in",
        },
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
        upage: {
            prof: "User profile",
            u: "Account",
            p: "Pokemon",
            m: "Moves",
            shbr: "Shiny broker",
            inf: "Info",
            sec: "Security",
        },
        info: {
            title: "User information",
            name: "User name",
            email: "Email",
            reg: "Registered at",
        },
        security: {
            os: "OS",
            ip: "IP",
            br: "Browser",
            acts: "Active sessions",
            soutall: "Sign out from all sessions",
            chpass: "Change password",
            npass: "New password",
            ok: "Password has been successfully changed",
            oldpass: "Old password",
            confnpass: "Confirm new password",
        },
        restore: {
            res: "Password reset",
            ok: `A message has been sent to you by email with instructions on how to reset your password. If you haven't recieved our message, try to check "Spam" or contact the site administrator`,
            tores: "Reset",

            confok: "New password has been successfully activated. Now you can log in using your new password",
            confnotok: "Password activation failed. Please try to reset your password once again or contact the site administrator",
        },
        moveconstr: {
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
        shbroker: {
            int: {
                title: "Shiny Broker: Trainers Search",
                choose: "Choose pokemon from my profile",

                name: "Name",
                country: "Country",
                region: "Region",
                city: "City",
                have: "Have",
                want: "Want",
                details: "Details",

                detcont: "Contact details:",
                dethave: "Can offer:",
                detwant: "Wants:",
            },

            find: "Find trainers",

            have: "Pokemon you have",
            want: "Pokemon you want",

            region: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Region\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            rPlaceYours: "Select your region",
            rPlace: "Select region (optional)",

            country: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Country\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            cPlaceYours: "Select your country",
            cPlace: "Select country (required)",

            city: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0City\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            cityPlaceYours: "Enter your city name",
            cityPlace: "Enter name (optional)",

            cont: "\xa0\xa0\xa0\xa0\xa0Contact details\xa0\xa0\xa0\xa0\xa0\xa0",
            contPlaceYours: "Enter your contact details",
            contPlace: "Enter contact details (optional)",

            amount: "Amount",

            err: {
                c1: "City name",
                c2: "city name",

                cd1: "Contact details",
                cd2: "contact details",
            }
        },
    },

    ru: {
        impExp: "Импорт/Экспорт",

        soon: "Эта функция скоро будет реализована. Пожалуйста, следите за обновлениями",
        loading: "Загрузка...",
        propc: "Регистрируясь вы соглашаетесь с ",
        and: "и",
        pol: {
            t: "Условия и положения",
            p: "Политика конфиденциальности",
        },

        userpok: {
            poktitle: "Покемоны пользователя",
            addpok: "Добавить покемона",
            or: "ИЛИ",

            err: {
                errname: "Вы должны выбрать покемона",
                errq: "Вы должны выбрать быстрое умение",
                errch: "Вы должны выбрать заряжаемое умение",
            },
        },

        signup: {
            newlin: "Есть аккаунт?",
            reg: "Регистрация",
            toreg: "Зарегистрироваться",
            uname: "Имя пользователя",
            pass: "Пароль",
            cpass: "Подтвердите пароль",
            email: "Адрес электронной почты",
        },
        signin: {
            forg: "Забыли ваш пароль?",
            rest: "Восстановить",
            newsup: "Нет аккаунта?",
            log: "Вход",
            tolog: "Войти",
        },
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
        upage: {
            prof: "Профиль пользователя",
            u: "Аккаунт",
            p: "Покемоны",
            m: "Умения",
            shbr: "Шайни брокер",
            inf: "Информация",
            sec: "Безопасность",
        },
        info: {
            title: "Информация о пользователе",
            name: "Имя пользователя",
            email: "Электронная почта",
            reg: "Зарегистрирован",
        },
        security: {
            os: "ОС",
            ip: "IP",
            br: "Браузер",
            acts: "Активные сессии",
            soutall: "Завершить все сессии",
            chpass: "Изменить пароль",
            npass: "Новый пароль",
            ok: "Пароль успешно изменен",
            oldpass: "Старый пароль",
            confnpass: "Подтвердите новый пароль",
        },
        restore: {
            res: "Сборс пароля",
            ok: `Письмо с инструкциями по восстановлению пароля было успешно отправлено на вашу электронную почту. Если вы не получили письмо, проверьте папку "Спам" или свяжитесь с администрацией сайта`,
            tores: "Сбросить",

            confok: "Новый пароль успешно активирован, теперь вы можете войти в на сайт под своим новым паролем",
            confnotok: "Активация пароля закончилась ошибкой. Пожалуйста повторите процедуру сброса пароля или свяжитесь с администрацией сайта",
        },
        moveconstr: {
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
        shbroker: {
            int: {
                title: "Шайни брокер: Поиск тренеров",
                choose: "Выбрать покемонов из моего профиля",

                name: "Имя",
                country: "Страна",
                region: "Регион",
                city: "Город",
                have: "Есть",
                want: "Нужно",
                details: "Детали",

                detcont: "Контактные данные:",
                dethave: "Может предложить:",
                detwant: "Хочет взамен:",
            },


            find: "Найти тренеров",

            have: "Ваши покемоны",
            want: "Нужные вам покемоны",

            country: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Страна\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            cPlaceYours: "Выберите вашу страну",
            cPlace: "Выберите страну (обязательно)",

            region: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Регион\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            rPlaceYours: "Выберите ваш регион",
            rPlace: "Выберите регион (опционально)",

            city: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Город\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
            cityPlaceYours: "Введите название вашего города",
            cityPlace: "Введите название города (опционально)",

            cont: "Контактные данные",
            contPlaceYours: "Введите ваши контактные данные",
            contPlace: "Введите контактные данные (опционально)",

            amount: "Количество",

            err: {
                c1: "Название города",
                c2: "названия города",

                cd1: "Контактные данные",
                cd2: "контактных данных",
            }
        },
    }
}