let run = false,
    hours = 0,
    minutes = 0,
    nodesNumber = 0,
    currentGeneratingModel = '',
    minuteVsReal = 500, //1000 - 24 минуты реального времени
    roadCoefs = [0.08, 0.02, 0.01, 0.02, 0.06, 0.14, 0.27, 0.30, 0.52, 0.68, 0.99, 0.84, 0.74, 0.75, 0.83, 0.97, 0.99, 0.95, 0.79, 0.47, 0.26, 0.24, 0.19, 0.12],
    //roadCoefs = [0.68, 0.85, 0.99, 0.99, 0.06, 0.14, 0.27, 0.30, 0.52, 0.68, 0.99, 0.84, 0.74, 0.75, 0.83, 0.97, 0.99, 0.95, 0.79, 0.47, 0.26, 0.24, 0.19, 0.12],
    carsInCity = 1000,
    edgeRefreshInterval,
    tempModelParameters,
    canvasArray = [],
    wasFilled = false,
    canvasArrayInterval = null,
    roadTripTimeOut,
    roadAccidents = [
        {name: 'Авария', speedCoefNerf: 0.9, bandwidthCoefNerf: 0.87},
        {name: 'Ремонт дороги', speedCoefNerf: 0.95, bandwidthCoefNerf: 0.8},
        {name: 'Препятствие (поломанный автомобиль)', speedCoefNerf: 0.99, bandwidthCoefNerf: 0.9},
    ],
    qualityTypes = [
        {name: 'Очень хорошее', coef: 1},
        {name: 'Хорошее', coef: 0.9},
        {name: 'Среднее', coef: 0.65},
        {name: 'Плохое', coef: 0.43},
        {name: 'Очень плохое', coef: 0.24},
    ],
    pavementTypes = [
        {name: 'Асфальтобетон', coef: 1},
        {name: 'Цементобетон', coef: 0.9},
        {name: 'Гравий', coef: 0.75},
        {name: 'Щебенка', coef: 0.6},
        {name: 'Грунт', coef: 0.5},
    ],
    roadClasses = [
        {
            name: 'Автобан',
            description: 'Главная магистраль с ограниченным доступом, обычно с двумя или более полосами движения в каждую сторону с железобетонным парапетным ограждением на разделительной полосе.',
            minSpeed: 90,
            maxSpeed: 110,
            laneNumber: 8
        },
        {
            name: 'Трасса федерального значения',
            description: 'Самые важные дороги в системе страны, которые не являются автомагистралями. (Не обязательно разделены ограждением на разделительной полосе.)',
            minSpeed: 80,
            maxSpeed: 90,
            laneNumber: 6
        },
        {
            name: 'Дорога между большими городами',
            description: 'Важные дороги в системе страны. (Часто связывают крупные города.)',
            minSpeed: 80,
            maxSpeed: 90,
            laneNumber: 4
        },
        {
            name: 'Загородное шоссе',
            description: 'Дороги в системе страны. (Часто связывают города.)',
            minSpeed: 70,
            maxSpeed: 90,
            laneNumber: 2
        },
        {
            name: 'Дорога между маленькими поселениями',
            description: 'Дороги в системе страны. (Часто связывают небольшие города и деревни)',
            minSpeed: 60,
            maxSpeed: 80,
            laneNumber: 2
        },
        {
            name: 'Дорога без классификации',
            description: 'Наименее важные дороги в системе страны - то есть второстепенные дороги более низкой классификации, но которые служат цели, отличной от доступа к собственности. (Часто связывают деревни и деревни.)',
            minSpeed: 40,
            maxSpeed: 60,
            laneNumber: 2
        },
        {
            name: 'Уличная дорога',
            description: 'Дороги, которые служат доступом к жилью, без функции связывания населенных пунктов.',
            minSpeed: 40,
            maxSpeed: 60,
            laneNumber: 2
        },
    ],

    edgeNewParameters = {
        lane: null,
        quality: null
    },
    cars = [],
    bimodalIntensity = [
        {0: {'time': '0-1', 'coef': 0.08}},
        {1: {'time': '1-2', 'coef': 0.02}},
        {2: {'time': '2-3', 'coef': 0.01}},
        {3: {'time': '3-4', 'coef': 0.02}},
        {4: {'time': '4-5', 'coef': 0.06}},
        {5: {'time': '5-6', 'coef': 0.14}},
        {6: {'time': '6-7', 'coef': 0.52}},
        {7: {'time': '7-8', 'coef': 0.68}},
        {8: {'time': '8-9', 'coef': 0.99}},
        {9: {'time': '9-10', 'coef': 0.7}},
        {10: {'time': '10-11', 'coef': 0.5}},
        {11: {'time': '11-12', 'coef': 0.54}},
        {12: {'time': '12-13', 'coef': 0.6}},
        {13: {'time': '13-14', 'coef': 0.61}},
        {14: {'time': '14-15', 'coef': 0.43}},
        {15: {'time': '15-16', 'coef': 0.48}},
        {16: {'time': '16-17', 'coef': 0.93}},
        {17: {'time': '17-18', 'coef': 0.95}},
        {18: {'time': '18-19', 'coef': 0.79}},
        {19: {'time': '19-20', 'coef': 0.47}},
        {20: {'time': '20-21', 'coef': 0.26}},
        {21: {'time': '21-22', 'coef': 0.24}},
        {22: {'time': '22-23', 'coef': 0.19}},
        {23: {'time': '23-24', 'coef': 0.12}}
    ],
    unimodalIntensity = [
        {0: {'time': '0-1', 'coef': 0.08}},
        {1: {'time': '1-2', 'coef': 0.02}},
        {2: {'time': '2-3', 'coef': 0.01}},
        {3: {'time': '3-4', 'coef': 0.02}},
        {4: {'time': '4-5', 'coef': 0.06}},
        {5: {'time': '5-6', 'coef': 0.14}},
        {6: {'time': '6-7', 'coef': 0.52}},
        {7: {'time': '7-8', 'coef': 0.68}},
        {8: {'time': '8-9', 'coef': 0.99}},
        {9: {'time': '9-10', 'coef': 0.7}},
        {10: {'time': '10-11', 'coef': 0.5}},
        {11: {'time': '11-12', 'coef': 0.54}},
        {12: {'time': '12-13', 'coef': 0.6}},
        {13: {'time': '13-14', 'coef': 0.54}},
        {14: {'time': '14-15', 'coef': 0.43}},
        {15: {'time': '15-16', 'coef': 0.4}},
        {16: {'time': '16-17', 'coef': 0.37}},
        {17: {'time': '17-18', 'coef': 0.35}},
        {18: {'time': '18-19', 'coef': 0.32}},
        {19: {'time': '19-20', 'coef': 0.28}},
        {20: {'time': '20-21', 'coef': 0.26}},
        {21: {'time': '21-22', 'coef': 0.24}},
        {22: {'time': '22-23', 'coef': 0.19}},
        {23: {'time': '23-24', 'coef': 0.12}}
    ],
    modelToSave = {
        name: null,
        intensity: null,
        intensityName: null
    };