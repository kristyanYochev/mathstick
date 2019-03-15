class Match
{
    constructor(x, y, angle, interactive)
    {
        this.sprite = new PIXI.Sprite(
            PIXI.loader.resources.matchstick.texture
        )

        var scale = MATCH_LENGTH / PIXI.loader.resources.matchstick.texture.width

        this.sprite.scale.set(scale, scale)
        this.sprite.anchor.set(0.5, 0.5)
        this.sprite.position.set(x, y)
        this.sprite.rotation = angle

        this.sprite.interactive = interactive

        this.sprite
            .on('mousedown', this.on_drag_start)
            .on('mouseup', this.on_drag_end)
            .on('mouseupoutside', this.on_drag_end)
            .on('mousemove', this.on_drag_move)
            .on('touchstart', this.on_drag_start)
            .on('touchend', this.on_drag_end)
            .on('touchmove', this.on_drag_move)
    }

    on_drag_start(event)
    {
        this.dragging = true
        this.drag_data = event.data
    }

    on_drag_end()
    {
        this.dragging = false
        this.drag_data = null
    }

    on_drag_move()
    {
        if (this.dragging)
        {
            var new_position = this.drag_data.getLocalPosition(this.parent)
            this.position.x = new_position.x
            this.position.y = new_position.y
        }
    }
}


class MatchesManager
{
    constructor()
    {
        this.matches = []
    }

    add_matchstick(x, y, angle, interactive)
    {
        var match = new Match(x, y, angle, interactive)

        stage.addChild(match.sprite)
        this.matches.push(match)
    }
}