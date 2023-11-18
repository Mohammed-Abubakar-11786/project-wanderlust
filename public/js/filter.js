// Add click event listeners to all elements with the 'icon-container' class
document.querySelectorAll(".filter").forEach((iconContainer) => {
  iconContainer.addEventListener("click", async () => {
    // Get the ID or any other information about the clicked icon
    const iconId = iconContainer.id;

    // Send a request to your backend or perform any other action
    try {
      fetch("http://localhost:8080/listings/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iconId: iconId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from your backend
          console.log(data);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
