const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = CANVAS_WIDTH * (9 / 16)

var renderer = PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT)

document.getElementById("game").appendChild(renderer.view)

////////////////////////////////////////////////////////////
var stage = new PIXI.Container()
stage.interactive = true

var matches_manager
var displays_manager

/**
 * Segments are numebered like so
 * 
 * Number symbol
 * 
 *    +---0---+
 *    |       |
 *    5       1
 *    |       |
 *    +---6---+
 *    |       |
 *    4       2
 *    |       |
 *    +---3---+
 * 
 * Operator symbol
 * 
 *       |
 *       1
 *    -0-+---
 *       |
 *       |
 * 
 * Equals symbol
 * 
 *   ---0---
 *   ---1---
 */
////////////////////////////////////////////////////////////
const MATCH_LENGTH = 80
const SNAP_DISTANCE = 30
const SEPARATION = 40
const PLAY_AREA_X = 100
const PLAY_AREA_Y = 200
const DISPLAY_SEGMENTS = {
    number: [
        {x: MATCH_LENGTH / 2, y: 0, angle: 0, interactive: true},
        {x: MATCH_LENGTH, y: MATCH_LENGTH / 2, angle: 3 * Math.PI / 2, interactive: true},
        {x: MATCH_LENGTH, y: 3 * MATCH_LENGTH / 2, angle: 3 * Math.PI / 2, interactive: true},
        {x: MATCH_LENGTH / 2, y: 2 * MATCH_LENGTH, angle: 0, interactive: true},
        {x: 0, y: 3 * MATCH_LENGTH / 2, angle: 3 * Math.PI / 2, interactive: true},
        {x: 0, y: MATCH_LENGTH / 2, angle: 3 * Math.PI / 2, interactive: true},
        {x: MATCH_LENGTH / 2, y: MATCH_LENGTH, angle: 0, interactive: true}
    ],
    operator: [
        {x: MATCH_LENGTH / 2, y: MATCH_LENGTH, angle: 0, interactive: true},
        {x: MATCH_LENGTH / 2, y: MATCH_LENGTH, angle: 3 * Math.PI / 2, interactive: true}
    ],
    equal_sign: [
        {x: MATCH_LENGTH / 2, y: 3 * MATCH_LENGTH / 4, angle: 0, interactive: false},
        {x: MATCH_LENGTH / 2, y: 5 * MATCH_LENGTH / 4, angle: 0, interactive: false}
    ]
}
const MAP_SYMBOLS_TO_SEGMENTS = {
    number: {
        '0': [0, 1, 2, 3, 4, 5],
        '1': [1, 2],
        '2': [0, 1, 6, 4, 3],
        '3': [0, 1, 6, 2, 3],
        '4': [5, 6, 1, 2],
        '5': [0, 5, 6, 2, 3],
        '6': [0, 5, 6, 4, 2, 3],
        '7': [0, 1, 2],
        '8': [0, 1, 2, 3, 4, 5, 6],
        '9': [0, 5, 6, 1, 2, 3]
    },
    operator: {
        '-': [0],
        '+': [0, 1]
    },
    equal_sign: {
        '=': [0, 1]
    }
}

////////////////////////////////////////////////////////////
PIXI.loader
    .add('matchstick', '/static/images/klechka.png')
    .load(init)

////////////////////////////////////////////////////////////
function init()
{
    matches_manager = new MatchesManager()
    displays_manager = new DisplaysManager()
    // matches_manager.add_matchstick(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, true)

    main_loop()
}

function main_loop()
{
    requestAnimationFrame(main_loop)
    renderer.render(stage)
}