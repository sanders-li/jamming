import React from 'react';

import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    Spotify.getAccessToken();

    this.state = {
      searchResults: [],
      playlistName: 'API_TEST',
      playlistTracks: []
    };
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  };

  addTrack(newTrack) {
    if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === newTrack.id)) {
      this.setState(prevState => (
        {playlistTracks: [...prevState.playlistTracks, newTrack]}
      ));
    }
  };
  
  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    });
  };

  updatePlaylistName(newName) {
    this.setState({playlistName: newName})
  };

  savePlaylist() {
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(playlistTrack => playlistTrack.uri))
    this.setState({playlistName: 'API_TEST', playlistTracks: []})
  };

  search(term) {
    if (!term) {
      this.setState({searchResults: []}) 
      return
    }
    Spotify.search(term)
    .then(searchResults => 
      this.setState({searchResults: searchResults})
    );
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
            />
            <Playlist 
              playlistTracks={this.state.playlistTracks} 
              playlistName={this.state.playlistName} 
              onNameChange={this.updatePlaylistName}
              onRemove={this.removeTrack} 
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  };
}

export default App;