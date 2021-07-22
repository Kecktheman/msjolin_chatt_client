<script>
     import Router from "svelte-spa-router";
     import active from 'svelte-spa-router/active'
     import { location } from "svelte-spa-router";

     import routes from "../routes.js";
</script>

<nav class="navbar is-transparent">
     <div class="navbar-brand">
          <h1>msjolin</h1>
          <div
               class="navbar-burger"
               data-target="navbarExampleTransparentExample"
          >
               <span />
               <span />
               <span />
          </div>
     </div>

     <div id="navbarExampleTransparentExample" class="navbar-menu">
          <div class="navbar-start">
               <a class="navbar-item" href="#/" use:active={{ path: '/' }}> Home </a>
               <a class="navbar-item" href="#/chat" use:active={{ path: '/chat' }}>
                    Join the chat!
               </a>
               <a class="navbar-item" href="#/api" use:active={{ path: '/api' }}> API's </a>
               <a class="navbar-item" href="#/download" use:active={{ path: '/download' }}> Files </a>
               <a class="navbar-item" href="#/css3d" use:active={{ path: '/css3d' }}> 3D CSS! </a>

          </div>

          <div class="navbar-end">
               <div class="navbar-item">
                    <div class="field is-grouped">
                         <p class="control">
                              <a
                                   class="bd-tw-button button"
                                   target="_blank"
                                   href="https://msjolin-planetarium.azurewebsites.net/"
                              >
                                   <span class="icon">
                                        <i class="fab fa-linkedin"></i>
                                   </span>
                                   <span> Planetarium </span>
                              </a>
                         </p>
                         <p class="control">
                              <a
                                   class="bd-tw-button button"
                                   target="_blank"
                                   href="https://se.linkedin.com/in/marcus-sj%C3%B6lin-455bb9142"
                              >
                                   <span class="icon">
                                        <i class="fab fa-linkedin"></i>
                                   </span>
                                   <span> LinkedIn </span>
                              </a>
                         </p>
                    </div>
               </div>
          </div>
     </div>
</nav>

<style lang="scss"> 
     .fab {
  

     }
</style>