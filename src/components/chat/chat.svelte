<script>
  import { fly } from "svelte/transition";

  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import { compareAsc, format } from "date-fns";

  import User from "./user.svelte";
  import Message from "./message.svelte";

  const delay = t => new Promise(resolve => setTimeout(resolve, t));

  let _messages = [];
  let _users = [];
  let client_socket = io();

  onDestroy(() => {
    console.warn("Disconnected from chat.");
    disconnect();
  });

  onMount(async () => {
    const messageForm = document.getElementById("send-container");
    const messageInput = document.getElementById("message-input");
    const messageContainer = document.getElementById("message-container");
    const userContainer = document.getElementById("user-container");
    let name = "";

    init("What is your name?");
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
            push("/");
          });
        } else {
          Promise.resolve(name)
            .then(() => {
              // FETCH USERS
              const chatHistory = fetchChatHIstory().then(data => {
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
              });
              console.log("MF", messageForm);
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
      messageContainer.scroll(0, messageContainer.scrollHeight);
    }
  });

  function disconnect() {
    client_socket.disconnect(name);
  }
</script>

<div
  id="chatter"
  class="section"
  in:fly={{ x: -1500, duration: 500 }}
  out:fly={{ x: 1500, duration: 500 }}>

  <h2>
    Yell
    <span class="smol">ow</span>
    room
  </h2>

  <div class="row main center">
    <div class="col">
      <div class="label">Users in room</div>
      <div id="user-container">
        {#each _users as user}
          <User {...user} />
        {/each}
        <!-- Online users -->
      </div>
    </div>
    <div class="col">
      <div class="label">(　ﾟДﾟ)</div>
      <div id="message-container">
        {#each _messages as message}
          <Message {...message} />
        {/each}
        <!-- Message container -->
      </div>
    </div>
  </div>
  <form id="send-container">
    <input type="text" id="message-input" />
    <button type="submit" id="submit-button">Yell</button>
  </form>
</div>
