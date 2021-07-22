import Home from "./views/home/home.svelte"
import Chat from "./views/chat/chat.svelte"
import Api from "./views/api/api.svelte"
import Files from "./views/files/files.svelte"
import CSS3D from "./views/CSS3D/CSS3D.svelte"

const routes = {
     "/": Home,
     "/chat": Chat,
     "/api": Api,
     "/download": Files,
     "/css3d": CSS3D,
     "*": Home,
}

export default routes