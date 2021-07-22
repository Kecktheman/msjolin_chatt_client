<script>
     import { fade, scale } from "svelte/transition";
     import { onMount } from "svelte";

     const quickmeme_image1 = "public/images/quickmeme_1.png";
     const quickmeme_image2 = "public/images/quickmeme_2.png";
     const quickmeme_image3 = "public/images/quickmeme_3.png";
     
</script>

<div>
     <a class="dlink" href="/download/quickmeme">Quickmeme v. 1.2</a>

     <div>
          Ett tillägg för Google Chrome där användaren med ett klicka kan hämta den senaste datan från <a href="https://imgur.com/">Imgur.com</a>.
     </div>

     <div class="flex">
          <div class="description">
               <div>
                    <h4>Startsida</h4>
                    <div>
                         <ul>
                              <li>Hämtar de mest populära/"virala" posterna.</li>
                              <li>Bara att börja scrolla!</li>
                         </ul>
                    </div>     
               </div>

               <div>
                    <img src={quickmeme_image1} alt="background image" />
               </div>
          </div>
     
          <div class="description">    
               <div>
                    <h4>Scrolla efter innehåll</h4>
                    <div>
                         <ul>
                              <li>Lazy loading på bilder och videos.</li>
                              <li>Se poäng och relevanta taggar per post.</li>
                              <li>Se antalet visningar globalt.</li>
                         </ul>
                    </div>
               </div>
 
               <div>
                    <img src={quickmeme_image2} alt="background image" />
               </div>
          </div>
     
          <div class="description">
               <div>
                    <h4>Sök</h4>
                    <div>
                         <ul>
                              <li>Sök för att matcha mot relevanta poster.</li>
                         </ul>
                    </div>
               </div>

               <div>
                    <img src={quickmeme_image3} alt="background image" />
               </div>
          </div>
     </div>

</div>

<style lang="scss">
     .dlink {
          display: block;
          margin-top: 1rem;
     }

     .description {
          flex: 1;
          display: flex;
          flex-direction: column;

          margin: 1rem .5rem;
          
          div:first-of-type {
               flex-grow: 1;
          }
     }

     img {
          max-height: 550px;
          max-width: 100%;
     }
</style>
