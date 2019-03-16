function create_room()
{
    var uid = ""
    var max_players = ""
    
    fetch('/create_room', {
        method: 'POST',
        headers: {
            'Contnet-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: uid,
            max_players: max_players
        })
    })
    .then(resp => resp.json())
    .then(resp => {
        document.getElementById().innerText = resp.room_id
    })
}