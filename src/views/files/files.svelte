<script>
     import { fade, scale } from "svelte/transition";
     import { onMount } from "svelte";

     import Quickmeme from "./quickmeme.svelte";
</script>

<div
     id="files"
     class="section is-content"
     out:scale={{ duration: 250 }}
     in:scale={{ duration: 250 }}
>
     <h1>Files</h1>

     <h2>Chrome Extensions</h2>

     <div class="protip">
          To install a chrome extension, open in the browser
          <b>chrome://extensions/</b>
          and then enable 'Developer mode' in the upper right corner. This must be
          done because the extension is not published as of now.
     </div>

     <ol class="px-5 mb-3">
          <li>Extract the downloaded archived file.</li>
          <li>
               Press Load unpack in the upper left corner of the
               chrome://extensions/ page.
          </li>
          <li>Load the 'dist' folder in the extracted folder.</li>
     </ol>

     <div class="downloadables">
          <div class="p-3">
               <Quickmeme></Quickmeme>
          </div>
     </div>

</div>

<style lang="scss">
     .downloadables {
          display: flex;
          flex-direction: column;

          > div {
               background: #fff;
          }

     }
</style>
