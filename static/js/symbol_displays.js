class Segment
{
    constructor(x, y, angle, interactive)
    {
        this.x = x
        this.y = y

        this.angle = angle
        this.interactive = interactive
    }

    has_matchstick()
    {
        for (var stick of matches_manager.matches)
        {
            if (
                stick.sprite.position.x == this.x &&
                stick.sprite.position.y == this.y &&
                stick.sprite.rotation == this.angle
            )
            {
                return true
            }
        }

        return false
    }

    add_matchstick()
    {
        if (this.has_matchstick())
        {
            return
        }

        matches_manager.add_matchstick(this.x, this.y, this.angle, this.interactive)
    }

    remove_matchstick()
    {
        if (!this.has_matchstick())
        {
            return
        }

        matches_manager.remove_matchstick_by_position(this.x, this.y, this.angle)
    }
}

class SymbolDisplay
{
    constructor()
    {
        this.segments = []

        this.segments.push(new Segment(200, 200, 0, true))
    }
}

class DisplaysManager
{
    constructor()
    {
        this.displays = []

        this.displays.push(new SymbolDisplay())
    }
}