<script>
     import { fade, scale } from "svelte/transition";
     import { onMount } from "svelte";
</script>

<div class="section is-content" out:scale={{ duration: 250 }} in:scale={{ duration: 250 }}>
     <h1>API's</h1>

     <div class="protip">
          Protip: Use this extension to beutify json data.
          <a
               href="https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh"
               target="_blank"
          >
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

<style>
     .content a {
          display: block;
          margin-bottom: 0.5rem;
     }
</style>
