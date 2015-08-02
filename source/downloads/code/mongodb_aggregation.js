db.ohlc.aggregate({
        $match: {
            S: 'QQQ'
        }
    }, {
        $project: {
            D: '$D', O: '$O', H: '$H', L: '$H', C: '$C', V: '$V', A: '$A',
            weeknbr: {
                $divide: [{
                        $subtract: [
                            '$D',
                            new ISODate('1970-01-04')
                        ]
                    },
                    86400 * 7000
                ]
            }
        }
    }, {
        $project: {
            D: '$D', O: '$O', H: '$H', L: '$H', C: '$C', V: '$V', A: '$A',
            rnd_weeknbr: {
                $subtract: [
                    '$weeknbr', {
                        $mod: [
                            '$weeknbr',
                            1
                        ]
                    }
                ]
            }
        }
    }, {
        $project: {
            D: '$D', O: '$O', H: '$H', L: '$H', C: '$C', V: '$V', A: '$A',
            grp_weeknbr: {
                $subtract: [
                    '$rnd_weeknbr', {
                        $mod: [
                            '$rnd_weeknbr',
                            4
                        ]
                    }
                ]
            }
        }
    }, {
        $sort: {
            D: 1
        }
    },

    {
        $group: {
            _id: {
                grp_weeknbr: '$grp_weeknbr'
            },
            D: {
                $last: '$D'
            },
            O: {
                $first: '$O'
            },
            H: {
                $max: '$H'
            },
            L: {
                $min: '$L'
            },
            C: {
                $last: '$C'
            },
            A: {
                $last: '$A'
            },
            V: {
                $sum: '$V'
            }
        }
    }, {
        $sort: {
            D: 1
        }
    }
)
