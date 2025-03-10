var socket = io();
         var user;
         var userColors = {}; // Store user colors

         function setUsername() {
            var username = document.getElementById('name').value;
            socket.emit('setUsername', username);
         }

         socket.on('userExists', function (data) {
            document.getElementById('error-container').innerHTML = data;
            document.getElementById('input-group').style.display = 'none'; // Hide the input-group
         });

         socket.on('userSet', function (data) {
            user = data.username;
            document.getElementById('error-container').innerHTML = ''; // Clear any error message
            document.getElementById('input-group').style.display = ''; // Show the input-group
            document.getElementById('join-chat').style.display = 'none'; // Hide the Join Chat button
            document.getElementById('error-container').style.display = 'none'; // Hide the Join Chat button
         });

         function sendMessage() {
            var msg = document.getElementById('message').value;
            if (msg) {
               socket.emit('msg', { message: msg, user: user });
               document.getElementById('message').value = '';
               scrollMessageContainerToBottom(); // Scroll to the bottom after sending a message
            }
         }

         socket.on('newmsg', function (data) {
            if (user) {
               // Assign a unique color to each user or reuse if already assigned
               // if (!userColors[data.user]) {
               //    userColors[data.user] = getRandomColor();
               // }
               var color = userColors[data.user];

               // Get the current date and time
               var currentDate = new Date();
               var formattedDate = currentDate.toLocaleString();

               // Create a new message element
               var messageElement = document.createElement('div');
               messageElement.style.maxHeight = '45px';

               // Set class based on user
               if (data.user === user) {
                  messageElement.className = 'alert alert-primary';
                  messageElement.style.textAlign = 'right';
               } else {
                  messageElement.className = 'alert alert-secondary';
                  messageElement.style.textAlign = 'left';
               }

               // Add message content
               messageElement.innerHTML = `
               <strong style="color: ${color};">${data.user}:</strong> ${data.message}
               <p>
               <span style="font-size: x-small;"><i>${formattedDate}</i></span>
               `;

               // Append the message element to the message container
               document.getElementById('message-container').appendChild(messageElement);

               scrollMessageContainerToBottom(); // Scroll to the bottom after adding a new message
            }
         });

         // Function to generate random colors
         function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
               color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
         }

         function scrollMessageContainerToBottom() {
            var messageContainer = document.getElementById('message-container');
            messageContainer.scrollTop = messageContainer.scrollHeight;
         }


//======= whenever a new message arrives, the title of the webpage will change to "New Message!" ===================================================================================================
         
         var hasUnreadMessage = false; // Flag to track unread messages

         // Function to update the title with a notification
         function updateTitle() {
            if (hasUnreadMessage) {
               document.title = "New Message!";
            } else {
               document.title = "Uchaptayu"; // Default title
            }
         }

         // Function to reset the title
         function resetTitle() {
            document.title = "Uchaptayu"; // Default title
            hasUnreadMessage = false;
         }

         socket.on('newmsg', function (data) {
            if (user) {
               hasUnreadMessage = true; // Set the flag when a new message arrives
               updateTitle(); // Update the title to notify the user

               // Rest of your message handling code here...

               // Scroll to the bottom after adding a new message
               scrollMessageContainerToBottom();
            }
         });

         // Add an event listener to reset the title when the window is focused
         window.addEventListener("focus", function() {
            resetTitle();
         });