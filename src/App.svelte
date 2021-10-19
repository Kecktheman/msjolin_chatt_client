<script>
  import { fade, scale } from "svelte/transition";

  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import { compareAsc, format } from "date-fns";

  import User from "./components/user.svelte";
  import Message from "./components/message.svelte";

  import "./global.scss";

  const delay = t => new Promise(resolve => setTimeout(resolve, t));
  const notificationImg =
    "/windows10/Square44x44Logo.targetsize-48_altform-unplated.png";

  let _messages = [];
  let _users = [];
  let client_socket = io();

  let name = "";

  let messageForm = null
  let messageInput = null
  let messageContainer = null
  let userContainer = null

  onDestroy(() => {
    console.warn("Disconnected from chat.");
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

              // You joined
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
              // SENT TO THE CONECTED USER ONLY ON FIRST OCNNECT
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

              // User joined
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
              // User joined
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
              console.log("CLICK!");

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
              console.log("Notifications turned on!");
            });

            adaptChatUI();
          })
          .catch(err => {
            console.error("Woops:", err);
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

<style lang="scss">
  #message-input {
    border: none;
    background: #fff6;
  }

  #submit-button {
    border: none;
    background: rgba(246, 71, 71, 0.5);
    font-weight: 700;
    cursor: pointer;
  }
</style>

<div
  id="chatter"
  class="p-4 is-content"
  out:scale={{ duration: 250 }}
  in:scale={{ duration: 250 }}>

  <h2 class="mb-3">Snattra</h2>
  <button id="chatter-disconnect" on:click={() => disconnect()}>
    Koppla ifrån
  </button>

  <div class="main center">
    <div class="row mb-3">
      <div class="col">
        <div class="label mb-1">Aktiva användare</div>
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
        <div class="label mb-1">Snatter</div>
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
    <input type="text" id="message-input" placeholder="Snattra något.." />
    <button type="submit" id="submit-button">Skicka</button>
  </form>

  {#if name == '' || name == null}
    <div id="chatter-overlay">
      <button on:click={() => init('What is your name?')}>
        Börja Snattra!
      </button>
    </div>
  {/if}
</div>
