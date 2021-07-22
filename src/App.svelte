<script>
     import Router from "svelte-spa-router"
     
     import Header from './components/header.svelte'

     import "./global.scss"
     import routes from  './routes.js'

</script>

<main class="section">

     <Header></Header>

     <Router {routes} />

</main>
