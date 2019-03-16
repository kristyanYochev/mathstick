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
var next_button
var undo_button
var start_time
var time_taken
var time_display
var game_mode = sessionStorage.getItem('game_mode')
var moved = false
var socket
var equations
var curr_equation_index = 0
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
    .add('matchstick', sessionStorage.getItem('stick_url'))
    .add('check', '/static/images/finish_button.png')
    .add('new', '/static/images/new.png')
    .add('reset', '/static/images/reload.png')
    .load(init)

////////////////////////////////////////////////////////////
function start_game(start_equations)
{
    equations = start_equations
    displays_manager.render_text(equations[0].equation)
    start_time = Date.now()
    game_state = 'running'
}

function undo()
{
    displays_manager.render_text(equations[curr_equation_index].equation)
    moved = false
}

function next_equation()
{
    fetch('/get/equation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: uid})
    })
    .then(resp => resp.json())
    .then(resp => {
        stage.removeChild(next_button)
        stage.addChild(finish_button)
        start_game([resp])
    })
}

function finish_game()
{
    if (check_if_game_finished() && game_state != 'finished')
    {
        if (game_mode == 'singleplayer')
        {
            game_state = 'finished'
            moved = false

            fetch('/complete', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: uid,
                    equation_id: equations[0].id,
                    time: time_taken / 1000
                })
            })
            .then(resp => resp.json())
            .then(resp => {
                document.getElementById('coin_count').innerText = resp.coins
            })
            
            stage.removeChild(finish_button)
            stage.addChild(next_button)
        }
        else
        {
            curr_equation_index++
            if (curr_equation_index >= equations.length)
            {
                game_state = 'finished'

                socket.emit('finish_game', {
                    room_id: sessionStorage.getItem('room_id'),
                    user_id: uid,
                    username: document.getElementById('username').value,
                    time: time_taken / 1000
                })
            }
            else
            {
                displays_manager.render_text(equations[curr_equation_index].equation)
                moved = false
            }
        }
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
    
    ////////////////////////////////////////////////////////////
    var background = new PIXI.Sprite(PIXI.loader.resources.background.texture)
    var bg_scale_x = CANVAS_WIDTH / PIXI.loader.resources.background.texture.width
    var bg_scale_y = CANVAS_HEIGHT / PIXI.loader.resources.background.texture.height

    background.scale.set(bg_scale_x, bg_scale_y)

    stage.addChild(background)

    ////////////////////////////////////////////////////////////
    undo_button = new PIXI.Sprite(PIXI.loader.resources.reset.texture)
    var undo_scale = 150 / PIXI.loader.resources.reset.texture.width
    undo_button.anchor.set(1, 0)
    undo_button.scale.set(undo_scale, undo_scale)
    undo_button.position.set(CANVAS_WIDTH, 0)
    undo_button.interactive = true

    undo_button.on('click', undo)

    stage.addChild(undo_button)
    
    ////////////////////////////////////////////////////////////
    finish_button = new PIXI.Sprite(PIXI.loader.resources.check.texture)
    var finish_scale = 200 / PIXI.loader.resources.check.texture.width

    finish_button.anchor.set(1, 1)
    finish_button.scale.set(finish_scale, finish_scale)
    finish_button.position.set(CANVAS_WIDTH, CANVAS_HEIGHT)
    finish_button.interactive = true

    finish_button.on('click', finish_game)

    stage.addChild(finish_button)

    ////////////////////////////////////////////////////////////
    next_button = new PIXI.Sprite(PIXI.loader.resources.new.texture)
    var next_scale = 200 / PIXI.loader.resources.new.texture.width

    next_button.anchor.set(1, 1)
    next_button.scale.set(next_scale, next_scale)
    next_button.position.set(CANVAS_WIDTH, CANVAS_HEIGHT)
    next_button.interactive = true

    next_button.on('click', next_equation)

    ////////////////////////////////////////////////////////////
    time_display = new PIXI.Text('', {fill: 0xd9b946})
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
            start_game([resp])
        })
    }
    else
    {
        socket = io.connect(window.location.origin)
        socket.on('connect', function() {
            socket.emit('join_room', {
                user_id: uid,
                username: username,
                room_id: sessionStorage.getItem('room_id')
            })
        })

        if (sessionStorage.getItem('equations'))
        {
            start_game(JSON.parse(sessionStorage.getItem('equations')))
        }
        else
        {
            socket.on('starting_game', function(data) {
                start_game(data.equations)
            })
        }

        socket.on('finished_game', function(data) {
            var player_element = document.createElement('p')
            player_element.innerText = data.username + ' - ' + data.time + 's'

            document.getElementById('players').appendChild(player_element)
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