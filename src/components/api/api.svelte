<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
</script>

<style>
  .content a {
    display: block;
    margin-bottom: 0.5rem;
  }
</style>

<div
  class="section"
  in:fly={{ x: -1500, duration: 500 }}
  out:fly={{ x: 1500, duration: 500 }}>

  <h1>API's</h1>

  <div class="protip">
    Protip: Use this extension to beutify json data.
    <a
      href="https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh"
      target="_blank">
      JSON Viewer
    </a>
  </div>

  <div class="content">
    <ul>
      <li>
        <a href="/users" taget="_blank">/users</a>
      </li>
      <li>
        <a href="/chat" taget="_blank">/chat history</a>
      </li>
    </ul>
  </div>
</div>
