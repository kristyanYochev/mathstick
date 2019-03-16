var socket
var uid = document.getElementById("uid").value
var username = document.getElementById('username').value
var players = []

function join_room()
{
    var room_id = document.getElementById('join_id').value

    socket = io.connect(window.location.origin)
    socket.on('connect', function() {
        socket.emit('join_room', {
            room_id: room_id,
            user_id: uid,
            username: username
        })

        sessionStorage.setItem('room_id', room_id)
    })

    socket.on('joined_room', function(data) {
        players = data.current_players

        var joined_players_element = document.getElementById('joined_players')
        joined_players_element.innerHTML = ''

        for (var user of players)
        {
            var player_element = document.createElement('span')
            player_element.innerText = user.username

            joined_players_element.appendChild(player_element)
        }
    })

    socket.on('starting_game', function(data) {
        console.log('starting game')
        sessionStorage.setItem('equations', JSON.stringify(data.equations))
        location.href = '/game'
    })

    // socket.disconnect()
}