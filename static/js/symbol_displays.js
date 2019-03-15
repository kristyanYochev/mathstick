class Segment
{
    constructor(x, y, angle, interactive)
    {
        this.x = x
        this.y = y

        this.angle = angle
        this.interactive = interactive
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