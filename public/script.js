(function init(window) {
  const { document, alert, $, Handlebars } = window;
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    let hashParams = {},
      e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function handleButtonClick(e) {
    if (e.target.nodeName === "BUTTON") {
      e.stopPropagation();
      const { track } = window.playlist.items[e.target.id];
      console.log("track", track);
      console.log("handle click", e);
      $.ajax({
        url: "https://api.deezer.com/search",
        data: {
          q: `artist:"${track.artists[0].name}"track:"${track.name}"`,
        },
        success(response) {
          console.log(response);
        },
      });
    }
  }

  var playlistSource = document.getElementById("playlist-template").innerHTML,
    playlistTemplate = Handlebars.compile(playlistSource),
    playlistPlaceholder = document.getElementById("playlists"),
    params = getHashParams(),
    { access_token } = params,
    { error } = params;

  if (error) {
    alert("There was an error during the authentication");
  } else if (access_token) {
    $("#login").hide();
    $("#loggedin").show();
  } else {
    // Render initial screen
    $("#login").show();
    $("#loggedin").hide();
  }

  function getSpotifyPlaylist(e) {
    console.log(e);
    e.stopPropagation();

    const playlistUrl = $("input[type=text]").val();

    if (!playlistUrl) {
      return;
    }

    const url = new URL(playlistUrl),
      playlistId = url.pathname.split("playlist/")[1];

    if (!playlistId) {
      return;
    }

    $.ajax({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      headers: { Authorization: `Bearer ${access_token}` },
      success(response) {
        window.playlist = response;
        playlistPlaceholder.innerHTML = playlistTemplate(response);
        $("#login").hide();
        $("#loggedin").show();

        const trackList = document.getElementById("track-list");
        trackList.addEventListener("click", handleButtonClick);
      },
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    const playlistForm = document.getElementById("playlist-form");
    playlistForm.addEventListener("submit", getSpotifyPlaylist);
  });
})(this);
