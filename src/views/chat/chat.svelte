<script>
	import { fade, scale } from 'svelte/transition';

     import { onMount } from "svelte";
     import { onDestroy } from "svelte";
     import { push, pop, replace } from "svelte-spa-router";
     import { compareAsc, format } from "date-fns";

     import User from "./user.svelte";
     import Message from "./message.svelte";

     const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));
     const notificationImg =
          "/windows10/Square44x44Logo.targetsize-48_altform-unplated.png";

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
                                   fetchChatHIstory().then((data) => {
                                        let count = data.response.count;
                                        for (let i = 0; i < count; i++) {
                                             let thisMessage = data.response.messages[i];
                                             _messages = [
                                                  ..._messages,
                                                  thisMessage,
                                             ];
                                        }

                                        // You joined
                                        _messages = [
                                             ..._messages,
                                             {
                                                  user: "SERVER",
                                                  message: `${name} joined the chat.`,
                                                  timeStamp: format(
                                                       new Date(),
                                                       "MM/dd HH:mm:ss"
                                                  ),
                                                  serverMessage: true,
                                             },
                                        ];
                                   });

                                   // First emit a event to the server with connected name.
                                   // The server responds with all connected names
                                   client_socket.emit("first-connect", name);

                                   client_socket.on(
                                        "first-connect-response",
                                        (users) => {
                                             // SENT TO THE CONECTED USER ONLY ON FIRST OCNNECT
                                             appendUsers(users, true);
                                             adaptChatUI();
                                        }
                                   );

                                   client_socket.on("chat-message", (data) => {
                                        // SENT TO OTHER USERS WHEN USER MESSAGES
                                        _messages = [
                                             ..._messages,
                                             {
                                                  user: data.name,
                                                  message: data.message,
                                                  timeStamp: format(
                                                       new Date(),
                                                       "MM/dd HH:mm:ss"
                                                  ),
                                             },
                                        ];

                                        new Notification(
                                             `${data.name}: "${data.message}"`,
                                             {
                                                  body: `${data.name} says: "${data.message}"`,
                                                  icon: notificationImg,
                                             }
                                        );
                                        adaptChatUI();
                                   });

                                   client_socket.on(
                                        "user-connected",
                                        (data) => {
                                             // SENT TO OTHER USERS WHEN NEW USER CONNECTS
                                             appendUsers(data.data, false);

                                             // User joined
                                             _messages = [
                                                  ..._messages,
                                                  {
                                                       user: "SERVER",
                                                       message: `${data.name} joined the chat.`,
                                                       timeStamp: format(
                                                            new Date(),
                                                            "MM/dd HH:mm:ss"
                                                       ),
                                                       serverMessage: true,
                                                  },
                                             ];

                                             new Notification(
                                                  "User connected",
                                                  {
                                                       body: `${data.name} joined the chat.`,
                                                       icon: notificationImg,
                                                  }
                                             );
                                             adaptChatUI();
                                        }
                                   );

                                   client_socket.on(
                                        "user-disconnected",
                                        (data) => {
                                             // SENT TO OTHER USERS WHEN USER DISCONNECT
                                             // User joined
                                             _messages = [
                                                  ..._messages,
                                                  {
                                                       user: "SERVER",
                                                       message: `${data.name} left the chat.`,
                                                       timeStamp: format(
                                                            new Date(),
                                                            "MM/dd HH:mm:ss"
                                                       ),
                                                       serverMessage: true,
                                                  },
                                             ];

                                             appendUsers(data.data, false);
                                             adaptChatUI();
                                        }
                                   );

                                   messageForm.addEventListener(
                                        "submit",
                                        (e) => {
                                             console.log("CLICK!");

                                             e.preventDefault();
                                             const message = messageInput.value;

                                             _messages = [
                                                  ..._messages,
                                                  {
                                                       user: name,
                                                       message: message,
                                                       timeStamp: format(
                                                            new Date(),
                                                            "MM/dd HH:mm:ss"
                                                       ),
                                                  },
                                             ];

                                             client_socket.emit(
                                                  "send-chat-message",
                                                  {
                                                       name: name,
                                                       message: message,
                                                  }
                                             );
                                             messageInput.value = "";
                                             adaptChatUI();
                                        }
                                   );

                                   Notification.requestPermission().then(
                                        function (result) {
                                             console.log(
                                                  "Notifications turned on!"
                                             );
                                        }
                                   );

                                   adaptChatUI();
                              })
                              .catch((err) => {
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
               data.users.forEach((user) => {
                    _users.push({
                         name: user.name,
                    });
               });
               _users = _users;
          }

          function adaptChatUI() {
               window.messageContainer = messageContainer
               setTimeout(() => {
                    // Fulfix för att låta data renderas innan vi hämtar höjden
                    messageContainer.scroll(0, messageContainer.scrollHeight);
               }, 100)
          }
     });

     function disconnect() {
          client_socket.disconnect(name);
     }
</script>

<div id="chatter" class="section is-content" out:scale="{{ duration: 250 }}" in:scale="{{ duration: 250 }}">    
     <h2 class="mb-3">
          Yell
          <span class="smol">ow</span>
          room
     </h2>

     <div class="row main center">
          <div class="col">
               <div class="label">Users in room</div>
               <div id="user-container">
                    <!-- Online users -->
                    {#each _users as user}
                         <User {...user} />
                    {/each}
               </div>
          </div>
          <div class="col">
               <div class="label">(　ﾟДﾟ)</div>
               <div id="message-container">
                    <!-- Message container -->
                    {#each _messages as message}
                         <Message {...message} />
                    {/each}
               </div>
          </div>
     </div>
     <form id="send-container">
          <input type="text" id="message-input" placeholder="Skrik något.." />
          <button type="submit" id="submit-button">Yell</button>
     </form>
</div>

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
