var socket
var players = []
var max_players

function create_room()
{
    var uid = document.getElementById('uid').value
    var username = document.getElementById('username').value
    max_players = document.getElementById('maximum_players').value
    
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

        socket = io.connect(window.location.origin)
        socket.on('connect', function() {
            socket.emit('join_room', {
                room_id: resp.room_id,
                user_id: uid,
                username: username
            })
        })

        socket.on('joined_room', function(data) {
            players = data.current_players

            var joined_players_element = document.getElementById('joined_players')
            joined_players_element.innerHTML = ''

            for (var player of players)
            {
                var playerElement = document.createElement('span')
                playerElement.innerText = player.username
    
                joined_players_element.appendChild(playerElement)
            }

        })
    })
}

document.getElementById('create_room').addEventListener('click', create_room)