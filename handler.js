document.addEventListener("DOMContentLoaded", () => {

  const handlerSearch = document.getElementById("handlerSearch");
  const handlerStageFilter = document.getElementById("handlerStageFilter");
  const handlerTaskList = document.getElementById("handlerTaskList");

  if (handlerSearch && handlerTaskList) {
    handlerSearch.addEventListener("input", filterHandlerTasks);
    handlerStageFilter.addEventListener("change", filterHandlerTasks);
  }

  function filterHandlerTasks() {
    const query = handlerSearch.value.toLowerCase().trim();
    const stage = handlerStageFilter.value;
    const items = handlerTaskList.querySelectorAll(".outbound-request-item");

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matchesSearch = !query || text.includes(query);
      
      let matchesStage = true;
      if (stage === "approved") {
        matchesStage = text.includes("inventory collection") || text.includes("approved");
      } else if (stage === "qc") {
        matchesStage = text.includes("quality control") || text.includes("inspection");
      } else if (stage === "packing") {
        matchesStage = text.includes("packing");
      }

      if (matchesSearch && matchesStage) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }

  const classificationSearch = document.getElementById("classificationSearch");
  const classificationList = document.getElementById("classificationList");

  if (classificationSearch && classificationList) {
    classificationSearch.addEventListener("input", () => {
      const query = classificationSearch.value.toLowerCase().trim();
      const items = classificationList.querySelectorAll(".outbound-request-item");

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

  const inventorySearch = document.getElementById("inventorySearch");
  const inventoryCategoryFilter = document.getElementById("inventoryCategoryFilter");
  const inventoryItemList = document.getElementById("inventoryItemList");

  if (inventorySearch && inventoryItemList) {
    function filterInventory() {
      const query = inventorySearch.value.toLowerCase().trim();
      const filter = inventoryCategoryFilter.value;
      const items = inventoryItemList.querySelectorAll(".outbound-request-item");

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matchesSearch = !query || text.includes(query);
        
        let matchesCategory = true;
        if (filter === "asset") {
          matchesCategory = text.includes("it-");
        } else if (filter === "consumable") {
          matchesCategory = text.includes("sku-") || text.includes("consumable");
        }

        if (matchesSearch && matchesCategory) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    }

    inventorySearch.addEventListener("input", filterInventory);
    inventoryCategoryFilter.addEventListener("change", filterInventory);
  }

  const handlerSupportForm = document.querySelector("#req-support form, #h-support form");

  if (handlerSupportForm) {
    handlerSupportForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const category = handlerSupportForm.querySelector("select").value;
      const priority = handlerSupportForm.querySelectorAll("select")[1]?.value || "normal";
      const summary = handlerSupportForm.querySelector("input")?.value.trim();
      const desc = handlerSupportForm.querySelector("textarea")?.value.trim();

      if (!category || !summary || !desc) {
        alert("Please complete all required fields before submitting your support ticket.");
        return;
      }

      const ticketId = "SUP-HANDLER-" + Math.floor(Math.random() * 9000 + 1000);
      alert(`Support ticket [${ticketId}] successfully submitted to IT administration.`);
      handlerSupportForm.reset();
    });
  }

});