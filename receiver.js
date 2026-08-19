
document.addEventListener("DOMContentLoaded", () => {
  const receiverSearch = document.getElementById("receiverSearch");
  const receiverInboundList = document.getElementById("receiverInboundList");

  if (receiverSearch && receiverInboundList) {
    receiverSearch.addEventListener("input", () => {
      const query = receiverSearch.value.toLowerCase().trim();
      const items = receiverInboundList.querySelectorAll(".outbound-request-item");

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