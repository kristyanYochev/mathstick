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