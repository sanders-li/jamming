const clientId = '05a275addfc24b2eb01fe61d6381c2e4';
//npm start
//const redirectUri = 'http://localhost:3000/'

//npm run build | surge ./build/ 
const redirectUri = 'http://surgesli.surge.sh/' 

let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            console.log('Already have access token ' + accessToken)
            return accessToken;
        } 
        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (urlAccessToken && urlExpiresIn) {
            accessToken = urlAccessToken[1]
            expiresIn = urlExpiresIn[1]
            window.setTimeout(() => accessToken = '', expiresIn * 1000)
            window.history.pushState('Access Token', null, '/')
        } else {
            console.log('Need access token')
            window.location = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`
        }
    },

    search(term) {
        return fetch(
            `https://api.spotify.com/v1/search?type=track&q=${term}`, 
            {headers: {Authorization: `Bearer ${accessToken}`}}
            )
        .then(response => response.json())
        .then(jsonResponse => {
            if (!jsonResponse.tracks) return [];
            return jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
        });
    },

    savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris) return

        let userId;
        let playlistId;
        const headers = {Authorization: `Bearer ${accessToken}`}
        
        fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);
            userId = jsonResponse.id
        })
        .then(() => {
            fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST', 
                headers: headers, 
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json())
            .then(jsonResponse => playlistId = jsonResponse.id)
            .then(() => {
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({uris: trackUris})
                });
            })
        })
    }
};

export default Spotify