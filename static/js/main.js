const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = CANVAS_WIDTH * (9 / 16)

var renderer = PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT)

document.body.appendChild(renderer.view)

////////////////////////////////////////////////////////////
var stage = new PIXI.Container()
stage.interactive = true

var matches_manager

////////////////////////////////////////////////////////////
const MATCH_LENGTH = 70

////////////////////////////////////////////////////////////
PIXI.loader
    .add('matchstick', '/static/images/klechka.png')
    .load(init)

////////////////////////////////////////////////////////////
function init()
{
    matches_manager = new MatchesManager()
    matches_manager.add_matchstick(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, true)

    main_loop()
}

function main_loop()
{
    requestAnimationFrame(main_loop)
    renderer.render(stage)
}