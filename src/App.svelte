<script>
  import { fade, scale } from "svelte/transition";
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import { compareAsc, format } from "date-fns";
  import Fa from 'svelte-fa/src/fa.svelte'

  import { faSignOutAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

  import User from "./components/user.svelte";
  import Message from "./components/message.svelte";
  import "./global.scss";

  const notificationImg = "/windows10/Square44x44Logo.targetsize-48_altform-unplated.png";

  let _messages = []
  let _users = []
  let client_socket = io();

  let name = ""
  let messageForm = null
  let messageInput = null
  let messageContainer = null
  let userContainer = null
  let minimized = false

  function clientLog(message, isError) {
    isError ? console.error(`-- CHAT: ${message}`) : console.info(`-- CHAT: ${message}`)
  }

  onDestroy(() => {
    clientLog("Disconnected from chat.");
    disconnect();
  });

  onMount(async () => {
    messageForm = document.getElementById("send-container");
    messageInput = document.getElementById("message-input");
    messageContainer = document.getElementById("message-container");
    userContainer = document.getElementById("user-container");
  });

  function init(string) {
    setTimeout(() => {
      name = prompt(string);

      if (name === "" || name === " ") {
        // USER USE EMPTY STRING AS NAME
        Promise.reject(name).catch(() => {
          init("You need a better name pal.");
        });
      } else if (name === null) {
        // USER DISMISSED PROMPT
        Promise.reject(name).catch(() => {
          return false;
        });
      } else {
        Promise.resolve(name)
          .then(() => {
            // FETCH USERS
            fetchChatHIstory().then(data => {
              let count = data.response.count;
              for (let i = 0; i < count; i++) {
                let thisMessage = data.response.messages[i];
                _messages = [..._messages, thisMessage];
              }

              // YOU JOINED
              _messages = [
                ..._messages,
                {
                  user: "SERVER",
                  message: `${name} joined the chat.`,
                  timeStamp: format(new Date(), "MM/dd HH:mm:ss"),
                  serverMessage: true
                }
              ];
            });

            // First emit a event to the server with connected name.
            // The server responds with all connected names
            client_socket.emit("first-connect", name);

            client_socket.on("first-connect-response", users => {
              // SENT TO THE CONECTED USER ONLY ON FIRST CONNECT
              appendUsers(users, true);
              adaptChatUI();
            });

            client_socket.on("chat-message", data => {
              // SENT TO OTHER USERS WHEN USER MESSAGES
              _messages = [
                ..._messages,
                {
                  user: data.name,
                  message: data.message,
                  timeStamp: format(new Date(), "MM/dd HH:mm:ss")
                }
              ];

              new Notification(`${data.name}: "${data.message}"`, {
                body: `${data.name} says: "${data.message}"`,
                icon: notificationImg
              });
              adaptChatUI();
            });

            client_socket.on("user-connected", data => {
              // SENT TO OTHER USERS WHEN NEW USER CONNECTS
              appendUsers(data.data, false);

              // OTHER USER JOINED
              _messages = [
                ..._messages,
                {
                  user: "SERVER",
                  message: `${data.name} joined the chat.`,
                  timeStamp: format(new Date(), "MM/dd HH:mm:ss"),
                  serverMessage: true
                }
              ];

              new Notification("User connected", {
                body: `${data.name} joined the chat.`,
                icon: notificationImg
              });
              adaptChatUI();
            });

            client_socket.on("user-disconnected", data => {
              // SENT TO OTHER USERS WHEN USER DISCONNECT
              // OTHER USER JOINED
              _messages = [
                ..._messages,
                {
                  user: "SERVER",
                  message: `${data.name} left the chat.`,
                  timeStamp: format(new Date(), "MM/dd HH:mm:ss"),
                  serverMessage: true
                }
              ];

              appendUsers(data.data, false);
              adaptChatUI();
            });

            messageForm.addEventListener("submit", e => {
              e.preventDefault();
              const message = messageInput.value;

              _messages = [
                ..._messages,
                {
                  user: name,
                  message: message,
                  timeStamp: format(new Date(), "MM/dd HH:mm:ss")
                }
              ];

              client_socket.emit("send-chat-message", {
                name: name,
                message: message
              });
              messageInput.value = "";
              adaptChatUI();
            });

            Notification.requestPermission().then(function(result) {
              clientLog("Notifications turned on!");
            });

            adaptChatUI();
          })
          .catch(err => {
            clientLog(err, true);
          });
      }
    }, 500);
  }

  async function fetchChatHIstory() {
    const respnse = await fetch(`${window.location.origin}/chat`);
    return await respnse.json();
  }

  function appendUsers(data, isYou) {
    data = JSON.parse(data);

    _users = [];
    data.users.forEach(user => {
      _users.push({
        name: user.name
      });
    });
    _users = _users;
  }

  function adaptChatUI() {
    window.messageContainer = messageContainer;
    setTimeout(() => {
      // Fulfix för att låta data renderas innan vi hämtar höjden
      messageContainer.scroll(0, messageContainer.scrollHeight);
    }, 100);
  }

  function disconnect() {
    client_socket.disconnect(name);
    _messages = [];
    _users = [];
    name = null;
  }
</script>

<div
  id="chatter"
  class="p-4 is-content"
  class:hidden={minimized}
  out:scale={{ duration: 250 }}
  in:scale={{ duration: 250 }}>

  <header>
    <h2>Käbbel-chatt</h2>
    
    <div class="header-actions">
      <button on:click={() => disconnect()} title="Disconnect from chat">
        <Fa icon={faSignOutAlt} />
      </button>
  
      <button on:click={() => minimized = !minimized} title="Minimize window">
        {#if minimized}
          <Fa icon={faAngleUp} />
        {:else}
          <Fa icon={faAngleDown} />
        {/if}
      </button>
    </div>
  </header>

  <div class="main center mt-3">
    <div class="row mb-3">
      <div class="col">
        <div class="label mb-1">Aktiva käbblare</div>
        <div id="user-container">
          <!-- Online users -->
          {#each _users as user}
            <User {...user} />
          {/each}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label mb-1">Käbbel</div>
        <div id="message-container">
          <!-- Message container -->
          {#each _messages as message}
            <Message {...message} />
          {/each}
        </div>
      </div>
    </div>
  </div>
  <form id="send-container">
    <input type="text" id="message-input" placeholder="Käbbla något.." autocomplete="off" />
    <button type="submit" id="submit-button" title="Skriv något och skicka">Käbbla</button>
  </form>

  {#if name == '' || name == null}
    <div id="chatter-overlay">
      <button on:click={() => init('What is your name?')}>
        Börja Snattra!
      </button>
    </div>
  {/if}
</div>
