document.getElementById("send").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value.trim();
    const responseDiv = document.getElementById("response");
  
    if (!prompt) {
      responseDiv.innerHTML += `
  <div class="chat-message bot">
    <strong>Devi:</strong> Please enter a question.
  </div>`;
      return;
    }
  
    // Show user's message
    responseDiv.innerHTML += `
  <div class="chat-message user">
    <strong>You:</strong> ${prompt}
  </div>`;
  
    try {
      const res = await fetch("http://localhost:5000/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          userId: "user123", // You can make this dynamic based on logged-in user
        }),
      });
  
      const data = await res.json();
      responseDiv.innerHTML += `
  <div class="chat-message bot">
    <strong>Devi:</strong><br>${data.reply.replace(/\n/g, "<br>")}
  </div>`;

    } catch (err) {
      console.error(err);
      responseDiv.innerHTML += `<p><strong>Devi:</strong> Something went wrong. Try again later.</p>`;
    }
  
    // Clear input
    document.getElementById("prompt").value = "";
  });
  
  
  
  
  
  
