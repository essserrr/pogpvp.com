export const matrixTips = {
    en: {
        overall: "Symbols in the overall rating (hover over a cell to get a tip)",
        result: "Result",
        color: "Color",
        cells: {
            v0: "Number of shields: 0 vs 0",
            v1: "Number of shields: 1 vs 1",
            v2: "Number of shields: 2 vs 2",
            over: "Overall rating",
        },
        colortip: {
            r2: "Rating under 370, lose",
            r1: "Rating 370-500, lose",
            g: "Rating equals 500, tie",
            g1: "Rating 500-630, win",
            g2: "Rating above 630, win",
        },
        par1: `Matrix PvP calculates results of the battle of each pokemon of the left column against each pokemon of the right column. Clicking on the rating in the results table will redirect you to the page of the corresponding single PvP. "Default settings" change the settings for all pokemon in the selected group at once, and also set the default settings for newly added pokemon. You also can save any party you created, for this you need to click on the "save" button and select a name for your party.`,
        par2: `When the "Overall rating" is turned on, the simulator calculates all 3 possible combinations of shields: 0x0, 1x1, 2x2. Based on the results of these 3 combinations, the overall rating is calculated by the formula of arithmetic mean (x1 + x2 + x3) / 3. When this option is enabled, changing of number of shields in the settings does not affect the battle results. Since 3 battle matrices are calculated at once, then the calculations may take a while.`,
    },
    ru: {
        overall: "Условные обозначения в общем рейтинге (наведите мышь на ячейку, что бы получить подсказку)",
        result: "Результат",
        color: "Цвет",
        cells: {
            v0: "Число щитов: 0 против 0",
            v1: "Число щитов: 1 против 1",
            v2: "Число щитов: 2 против 2",
            over: "Общий рейтинг",
        },
        colortip: {
            r2: "Рейтинг ниже 370, поражение",
            r1: "Рейтинг 370-500, поражение",
            g: "Рейтинг равен 500, ничья",
            g1: "Рейтинг 500-630, победа",
            g2: "Рейтинг выше 630, победа",
        },
        par1: `Матричное PvP считает результаты боя каждого покемона левого столбца против каждого покемона правого столбца. Клик по рейтингу в таблице результатов перенправит Вас на страницу каждого отдельного PvP. "Настройки по-умолчанию" меняют параметры сразу у всех покемонов в выбранной группе, а так же устанавливают соотвествующие настройки по-умолчанию для вновь добавляемых покемонов. Также имеется возможность сохранить созданную группу, для этого нужно нажать на кнопку "сохранить" и выбрать имя для вышей группы.`,
        par2: `Включение общего рейтинга заставляется симулятор считать сразу 3 возможных комбинации щитов: 0х0, 1х1, 2х2. По результатам этих 3 комбинаций вычисляется общий рейтинг, равный среднему арифметическому (x1+x2+x3)/3. Когда эта опция включена, изменение количества щитов в настройках не влияет на исход боя. Так как за 1 раз считается сразу 3 матрицы, то вычисления могут занять некоторое время.`,
    }
}