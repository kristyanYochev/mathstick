var socket
var players = []
var max_players

function create_room()
{
    var uid = document.getElementById('uid').value
    var username = document.getElementById('username').value
    max_players = document.getElementById('maximum_players').value
    var equation_count = document.getElementById('number_of_equations').value
    
    fetch('/create_room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: uid,
            max_players: max_players
        })
    })
    .then(resp => resp.json())
    .then(resp => {
        document.getElementById('room_id').innerText = resp.room_id

        var start_game_button = document.createElement('input')
        start_game_button.value = 'Start Game'
        start_game_button.type = 'button'
        start_game_button.classList.add('button')
        start_game_button.onclick = function() {
            socket.emit('start_game', {
                room_id: sessionStorage.getItem('room_id'),
                equations_count: sessionStorage.getItem('equation_count')
            })
        }

        socket = io.connect(window.location.origin)
        socket.on('connect', function() {
            socket.emit('join_room', {
                room_id: resp.room_id,
                user_id: uid,
                username: username
            })

            sessionStorage.setItem('room_id', resp.room_id)
            sessionStorage.setItem('equation_count', equation_count)
        })

        document.getElementById('controls').appendChild(start_game_button)

        socket.on('joined_room', function(data) {
            players = data.current_players

            var joined_players_element = document.getElementById('joined_players')

            for (var player of players)
            {
                var playerElement = document.createElement('span')
                playerElement.innerText = player.username
    
                joined_players_element.appendChild(playerElement)
            }

        })

        socket.on('starting_game', function(data) {
            sessionStorage.setItem('equations', JSON.stringify(data.equations))
            location.href = '/game'
        })
    })
    document.getElementById('create_room').disabled = true
}

