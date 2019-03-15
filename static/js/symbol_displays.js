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
    constructor(x, y, type)
    {
        this.segments = []
        this.type = type
        this.x = x
        this.y = y
        
        // this.segments.push(new Segment(200, 200, 0, true))
        for (var segment of DISPLAY_SEGMENTS[type])
        {
            this.segments.push(new Segment(
                this.x + segment.x,
                this.y + segment.y,
                segment.angle,
                segment.interactive
            ))
        }
    }

    clear()
    {
        for (var segment of this.segments)
        {
            segment.remove_matchstick()
        }
    }

    render_symbol(symbol)
    {
        this.clear()

        if (!(symbol in MAP_SYMBOLS_TO_SEGMENTS[this.type]))
        {
            return
        }

        for (var segment of MAP_SYMBOLS_TO_SEGMENTS[this.type][symbol])
        {
            this.segments[segment].add_matchstick()
        }
    }

    get_on_segments()
    {
        var on_segments = []

        for (var segment_number in this.segments)
        {
            if (this.segments[segment_number].has_matchstick())
            {
                on_segments.push(parseInt(segment_number))
            }
        }

        return on_segments
    }

    get_symbol()
    {
        var on_segments = this.get_on_segments()

        for (var symbol in MAP_SYMBOLS_TO_SEGMENTS[this.type])
        {
            if (arrays_have_same_members(on_segments, MAP_SYMBOLS_TO_SEGMENTS[this.type][symbol]))
            {
                return symbol
            }
        }

        return null
    }
}

class DisplaysManager
{
    constructor()
    {
        this.displays = []

        this.displays.push(new SymbolDisplay(PLAY_AREA_X, PLAY_AREA_Y, 'number'))
    }

    add_display(type)
    {
        var x
        var y = PLAY_AREA_Y
        if (this.displays.length == 0)
        {
            x = PLAY_AREA_X
        }
        else
        {
            x = this.displays[this.displays.length - 1].x + MATCH_LENGTH + SEPARATION
        }
        this.displays.push(new SymbolDisplay(x, y, type))
    }

    render_text(text)
    {
        for (var display of this.displays)
        {
            display.clear()
        }

        this.displays = []

        for (var symbol of text)
        {
            var type = ''
            if (symbol in MAP_SYMBOLS_TO_SEGMENTS['number'])
            {
                type = 'number'
            }
            else if (symbol in MAP_SYMBOLS_TO_SEGMENTS['operator'])
            {
                type = 'operator'
            }
            else if (symbol == '=')
            {
                type = 'equal_sign'
            }

            this.add_display(type)

            this.displays[this.displays.length - 1].render_symbol(symbol)
        }
    }
}