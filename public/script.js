 (function() {
   /**
    * Obtains parameters from the hash of the URL
    * @return Object
    */
   function getHashParams() {
     var hashParams = {};
     var e, r = /([^&;=]+)=?([^&;]*)/g,
       q = window.location.hash.substring(1);
     while (e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
     }
     return hashParams;
   }

   function handleButtonClick(e) {
     if (e.target.nodeName === "BUTTON") {
       e.stopPropagation();
       var track = window.playlist.items[e.target.id].track;
       console.log("track", track);
       console.log("handle click", e);
       $.ajax({
         url: "https://api.deezer.com/search",
         data: {
           q: `artist:\"${track.artists[0].name}\" track:\"${track.name}\"`
         },
         success: function(response) {
           console.log(response);
         }
       });
     }
   }

   function getSpotifyPlaylist(e) {
     if (e.target.nodeName === "BUTTON") {
       e.stopPropagation();

       var playlistUrl = $("input[type=text]").val();

       if (!playlistUrl) {
         return;
       }

       var url = new URL(playlistUrl);
       var playlistId = url.pathname.split("playlist/")[1]

       if (!playlistId) {
         return;
       }

       $.ajax({
         url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
         headers: {
           'Authorization': 'Bearer ' + access_token
         },
         success: function(response) {
           window.playlist = response;
           playlistPlaceholder.innerHTML = playlistTemplate(response);
           $('#login').hide();
           $('#loggedin').show();

           var trackList = document.getElementById("track-list");
           trackList.addEventListener("click", handleButtonClick);
         }
       });
     }
   }

   var playlistSource = document.getElementById('playlist-template').innerHTML,
     playlistTemplate = Handlebars.compile(playlistSource),
     playlistPlaceholder = document.getElementById('playlists');

   var params = getHashParams();

   var access_token = params.access_token,
     refresh_token = params.refresh_token,
     error = params.error;

   if (error) {
     alert('There was an error during the authentication');
   } else {
     if (access_token) {
       $('#login').hide();
       $('#loggedin').show();
     } else {
       // render initial screen
       $('#login').show();
       $('#loggedin').hide();
     }
   }

   window.addEventListener('DOMContentLoaded', (event) => {
     console.log('DOM fully loaded and parsed');

     var playlistForm = document.getElementById("playlist-form");
     playlistForm.addEventListener("click", getSpotifyPlaylist);
   });
 })();
