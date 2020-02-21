<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
</script>

<style>
  .dlink {
    display: block;
    margin-top: 1rem;
  }
</style>

<div
  id="files"
  class="section"
  in:fly={{ x: -1500, duration: 500 }}
  out:fly={{ x: 1500, duration: 500 }}>

  <h1>Files</h1>

  <h2>Chrome Extensions</h2>

  <div class="protip">
    To install a chrome extension, open in the browser
    <b>chrome://extensions/</b>
    and then enable 'Developer mode' in the upper right corner. This must be
    done because the extension is not published as of now.
  </div>

  <ol>
    <li>Extract the downloaded archived file.</li>
    <li>
      Press Load unpack in the upper left corner of the chrome://extensions/
      page.
    </li>
    <li>Load the 'dist' folder in the extracted folder.</li>
  </ol>

  <ul>
    <li>
      <a class="dlink" href="/download/quickmeme">Quickmeme v. 1.2</a>
    </li>
  </ul>

</div>
