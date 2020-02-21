<script>
  import Router from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import { location } from "svelte-spa-router";

  import Home from "./components/home/home.svelte";
  import Chat from "./components/chat/chat.svelte";
  import Api from "./components/api/api.svelte";
  import route_70_483 from "./components/70_483/70_483.svelte";
  import Files from "./components/files/files.svelte";

  const routes = {
    "/": Home,
    "/chat": Chat,
    "/api": Api,
    "/70_483": route_70_483,
    "/download": Files,
    "*": Home
  };
</script>

<main class="section">
  <h1>msjolin</h1>

  <nav>
    <ul>
      <li>
        <a href="#/" use:active>Home</a>
      </li>
      <li>
        <a href="#/chat" use:active class="chatter">Join the chat!</a>
      </li>
      <li>
        <a href="#/api" use:active class="spotify">API</a>
      </li>
      <!--       <li>
        <a href="#/70_483" use:active class="cert">C# 70-483</a>
      </li> -->
      <li>
        <a href="#/download" use:active class="files">Files</a>
      </li>
    </ul>
  </nav>

  <Router {routes} />

</main>
