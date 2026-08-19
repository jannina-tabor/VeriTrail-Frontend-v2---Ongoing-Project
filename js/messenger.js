
document.addEventListener("DOMContentLoaded", () => {
  const messengerSearch = document.getElementById("messengerSearch");
  const messengerQueueList = document.getElementById("messengerQueueList");

  if (messengerSearch && messengerQueueList) {
    messengerSearch.addEventListener("input", () => {
      const query = messengerSearch.value.toLowerCase().trim();
      const items = messengerQueueList.querySelectorAll(".outbound-request-item");

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
});