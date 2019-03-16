const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = CANVAS_WIDTH * (9 / 16)

var renderer = PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT)

document.getElementById("game").appendChild(renderer.view)

////////////////////////////////////////////////////////////
var stage = new PIXI.Container()
stage.interactive = true
var game_state = 'waiting'

var matches_manager
var displays_manager
var finish_button
var start_time
var time_taken
var time_display
var game_mode = document.getElementById('gamemode').value
var socket
var equations

var uid
var equation_id

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
    .add('background', '/static/images/green_background.png')
    .add('matchstick', '/static/images/stick4.png')
    .add('check', '/static/images/coins_broken_transperent.png')
    .load(init)

////////////////////////////////////////////////////////////
function start_game(equations)
{
    equations = equations
    start_time = Date.now()
    game_state = 'running'
}

function finish_game()
{
    if (check_if_game_finished())
    {
        game_state = 'finished'
        
        fetch('/complete', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: uid,
                equation_id: equation_id,
                time: time_taken / 1000
            })
        })
        alert(time_taken / 1000 + 's')
    }
}

////////////////////////////////////////////////////////////
function check_if_game_finished()
{
    var display_value = displays_manager.get_text()

    if (display_value)
    {
        var sides = display_value.split('=')
        if (eval(sides[0]) == eval(sides[1]))
        {
            return true
        }
    }

    return false
}

////////////////////////////////////////////////////////////
function init()
{
    matches_manager = new MatchesManager()
    displays_manager = new DisplaysManager()
    // matches_manager.add_matchstick(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, true)
    
    ////////////////////////////////////////////////////////////
    var background = new PIXI.Sprite(PIXI.loader.resources.background.texture)
    var bg_scale_x = CANVAS_WIDTH / PIXI.loader.resources.background.texture.width
    var bg_scale_y = CANVAS_HEIGHT / PIXI.loader.resources.background.texture.height

    background.scale.set(bg_scale_x, bg_scale_y)

    stage.addChild(background)
    
    ////////////////////////////////////////////////////////////
    finish_button = new PIXI.Sprite(PIXI.loader.resources.check.texture)
    var finish_scale = 200 / PIXI.loader.resources.check.texture.width

    finish_button.scale.set(finish_scale, finish_scale)
    finish_button.position.set(CANVAS_WIDTH - 170, CANVAS_HEIGHT - 170)
    finish_button.interactive = true

    finish_button.on('click', finish_game)

    stage.addChild(finish_button)

    ////////////////////////////////////////////////////////////
    time_display = new PIXI.Text('')
    time_display.anchor.set(0.5, 0)
    time_display.position.set(CANVAS_WIDTH / 2, 0)

    stage.addChild(time_display)

    ////////////////////////////////////////////////////////////
    uid = document.getElementById("user_id").value

    if (game_mode == 'singleplayer')
    {
        fetch('/get/equation', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: uid})
        })
        .then(resp => resp.json())
        .then(resp => {
            displays_manager.render_text(resp.equation)
            equation_id = resp.id
        })
    }
    else
    {
        socket = io.connect(window.location.origin)
        socket.on('connect', function() {
            socket.emit('start_game', {user_id: uid})
        })

        socket.on('starting_game', function(data) {
            equations = data.equations

            start_game(equations)
        })
    }

    ////////////////////////////////////////////////////////////
    main_loop()
}

function main_loop()
{
    if (game_state == 'running')
    {
        time_taken = Date.now() - start_time
        time_display.text = (time_taken / 1000).toFixed(2) + 's'
    }
    requestAnimationFrame(main_loop)
    renderer.render(stage)
}