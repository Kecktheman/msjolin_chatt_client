<script>
     import { fade, scale } from "svelte/transition";

     let requestUrl = "https://api.spotify.com/v1/me/player/";

     let bearerKey = "";
     console.log(bearerKey);

     /*   $: currentlyPlaying = null;
      */
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

<div
     id="home"
     class="section is-content"
     out:scale={{ duration: 250 }}
     in:scale={{ duration: 250 }}
>
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
