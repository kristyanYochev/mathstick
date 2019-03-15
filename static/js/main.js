const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = CANVAS_WIDTH * (9 / 16)

var renderer = PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT)

document.body.appendChild(renderer.view)

////////////////////////////////////////////////////////////
var stage = new PIXI.Container()
stage.interactive = true

////////////////////////////////////////////////////////////
PIXI.loader
    .add('matchsick', '/static/images/klechka.png')
    .load(init)

////////////////////////////////////////////////////////////
function init()
{
    
}

function main_loop()
{
    requestAnimationFrame(main_loop)
    renderer.render(stage)
}