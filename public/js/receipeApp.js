// public/js/recipeApp.js
$(document).ready(function () {
    $('#modal-button').on('click', function () {
      const $body = $('#coursesModal .modal-body');
      $body.html('<p>Loading courses…</p>');
  
      $.get('/api/courses')
        .done(function (response) {
          $body.empty();
  
          const courses = response.data;
  
          if (!courses.length) {
            return $body.append('<p>No courses available at the moment.</p>');
          }
  
          courses.forEach(course => {
            $body.append(`
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">${course.title}</h5>
                  <p class="card-text">${course.description}</p>
                  <button 
                    class="btn btn-success join-button" 
                    data-id="${course._id}">
                    Join Course
                  </button>
                </div>
              </div>
            `);
          });
  
          addJoinButtonListener();
        })
        .fail(function () {
          $body.html('<p class="text-danger">Failed to load courses.</p>');
        });
    });
  
    function addJoinButtonListener() {
      $('.join-button').on('click', function () {
        const button = $(this);
        const courseId = button.data('id');
  
        fetch(`/api/courses/${courseId}/join`, {
          method: 'POST',
          credentials: 'include', // important for session cookie
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({}) // you can leave it empty if only using params
        })
          .then(res => res.json())
          .then(response => {
            if (response.success) {
              button
                .removeClass('join-button btn-success')
                .addClass('joined-button btn-secondary')
                .text('Joined')
                .prop('disabled', true);
            } else if (response.message === 'User not logged in.') {
              alert("Please log in to join the course.");
              window.location.href = "/users/login";
            } else {
              button.text('Try again');
            }
          })
          .catch(() => {
            button.text('Failed to join');
          });
      });
    }
  });
  
      
  document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const chatInput = document.getElementById("chat-input");
    const messages = document.getElementById("chat-messages");
    const chatWidget = document.getElementById("chat-widget");
    const chatHeader = document.getElementById("chat-header");
    const sendButton = document.getElementById("send-button");
    const emojiButton = document.getElementById("emoji-button");
    const attachButton = document.getElementById("attach-button");
    const fileInput = document.getElementById("file-input");
  
    // Toggle minimize on header click
    chatHeader.addEventListener("click", () => {
      chatWidget.classList.toggle("minimized");
    });
  
    // Send message
    sendButton.addEventListener("click", () => {
      const message = chatInput.value.trim();
      if (message) {
        socket.emit("chat message", {
          user: window.currentUserName || "Anonymous",
          message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        chatInput.value = "";
        chatInput.style.height = "auto";
      }
    });
  
    // Auto-scroll on new message
    socket.on("chat message", function (data) {
      const item = document.createElement("li");
      item.innerHTML = `<strong>${data.user}</strong> <small class="text-muted">[${data.time}]</small>: ${data.message}`;
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
    });
  
    // Auto-expand textarea height
    chatInput.addEventListener("input", () => {
      chatInput.style.height = "auto";
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });
  
    // Emoji button
    emojiButton.addEventListener("click", () => {
      chatInput.value += "😊";
      chatInput.dispatchEvent(new Event("input"));
    });
  
    // Attach file
    attachButton.addEventListener("click", () => {
      fileInput.click();
    });
  
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        alert(`Selected file: ${fileInput.files[0].name}`);
        // You can handle actual upload here later
      }
    });
  });
  