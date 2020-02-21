<script>
  import { fly } from "svelte/transition";

  let requestUrl = "https://api.spotify.com/v1/me/player/";

  let bearerKey = "";
  console.log(bearerKey);

  $: currentlyPlaying = null;

  /* let getStuff = new Promise(resolve => {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        console.log("Processing request...");

        let json = JSON.parse(req.responseText);
        console.log("jonson", json);

        resolve(json);
      } else {
        console.log("Error with Spotify Request.");
      }
    };
    req.open("GET", requestUrl, true); // true for asynchronous
    req.setRequestHeader("Authorization", `Bearer ${bearerKey}`);
    req.send(null);
  });

  getStuff.then(value => {
    currentlyPlaying = value;
    console.log("currentlyPlaying", currentlyPlaying);
  }); */
</script>

<style type="text/scss">
  #spotify {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #222326;

    h1 {
      position: absolute;
      right: 0;
      right: -1rem;
      bottom: -2rem;

      font-size: 7rem;
      color: #343539;
    }

    h2,
    h3 {
      color: #1ed760;
    }
    span {
      color: #fff;
    }

    img {
      width: 100px;
      height: 100px;
    }

    .spotify_main {
      display: flex;
      max-height: 100px;
      text-decoration: none;
      .left {
        margin: 0 1rem;
      }
      .right {
        flex: 4;
      }
    }
  }
</style>

<div
  id="home"
  class="section"
  in:fly={{ x: -1500, duration: 500 }}
  out:fly={{ x: 1500, duration: 500 }}>

  <h1>Home</h1>

  <!-- <div id="spotify">
    {#if currentlyPlaying !== null}
      <a
        href={currentlyPlaying.item.external_urls.spotify}
        class="spotify_main">
        <div class="left">
          <img
            src={currentlyPlaying.item.album.images[0].url}
            alt="album cover" />
        </div>
        <div class="right">
          <h3>Currently playing: {currentlyPlaying.item.name}</h3>
          <span>
            {currentlyPlaying.item.artists[0].name}:
            <span>{currentlyPlaying.item.album.name}</span>
          </span>
        </div>
      </a>
    {:else}
      <div class="lds-facebook">
        <div />
        <div />
        <div />
      </div>
    {/if}
  </div> -->

</div>
