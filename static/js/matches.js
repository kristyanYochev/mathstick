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

            for (var display of displays_manager.displays)
            {
                for (var segment of display.segments)
                {
                    if (
                        distance_between_points(new_position.x, new_position.y, segment.x, segment.y) < SNAP_DISTANCE &&
                        !segment.has_matchstick()
                    )
                    {
                        this.position.x = segment.x
                        this.position.y = segment.y
                        this.rotation = segment.angle

                        return
                    }
                }
            }
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

    remove_matchstick_by_position(x, y, angle)
    {
        var removed_match

        for (var match_index in this.matches)
        {
            if (
                this.matches[match_index].sprite.position.x == x &&
                this.matches[match_index].sprite.position.y == y &&
                this.matches[match_index].sprite.rotation == angle
            )
            {
                removed_match = this.matches.splice(match_index, 1)[0]
            }
        }

        stage.removeChild(removed_match.sprite)
        removed_match.sprite.destroy()
    }
}