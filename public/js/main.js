import { api } from "./api.js";
import { ui } from "./ui.js";

// Global state
// (variables can be added here if needed)

async function loadData() {
  try {
    const [destinations, journals, stats] = await Promise.all([
      api.getDestinations(),
      api.getJournals(),
      api.getStats(),
    ]);

    ui.renderDestinations(destinations);
    ui.renderJournals(journals);
    ui.renderStats(stats);
  } catch (err) {
    console.error("Error loading data:", err);
  }
}

function setupEventListeners() {
  // Navigation
  document
    .getElementById("nav-bucketlist")
    .addEventListener("click", () => ui.switchView("bucketlist"));
  document
    .getElementById("nav-journal")
    .addEventListener("click", () => ui.switchView("journal"));

  // Destination Form
  const destForm = document.getElementById("destination-form");
  destForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("dest-id").value;
    const data = {
      name: document.getElementById("dest-name").value,
      budget: document.getElementById("dest-budget").value,
      description: document.getElementById("dest-desc").value,
    };

    try {
      if (id) {
        await api.updateDestination(id, data);
      } else {
        await api.createDestination(data);
      }
      ui.setFormEditing(false); // reset form
      await loadData();
    } catch (err) {
      console.error("Error saving destination:", err);
      alert("Error saving destination. Please try again.");
    }
  });

  // Cancel Edit
  document.getElementById("btn-cancel-edit").addEventListener("click", () => {
    ui.setFormEditing(false);
  });

  // List Actions (Event Delegation)
  document
    .getElementById("destinations-list")
    .addEventListener("click", async (e) => {
      const btn = e.target;
      if (!btn.classList.contains("action-btn")) return;

      const id = btn.dataset.id;

      if (btn.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this trip idea?")) {
          try {
            await api.deleteDestination(id);
            await loadData();
          } catch (err) {
            console.error("Error deleting destination:", err);
          }
        }
      } else if (btn.classList.contains("edit-btn")) {
        ui.setFormEditing(true, {
          id: id,
          name: btn.dataset.name,
          budget: btn.dataset.budget,
          desc: btn.dataset.desc,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (btn.classList.contains("complete-btn")) {
        if (confirm("Did you finish this trip? Awesome! Moving to journals.")) {
          try {
            await api.completeDestination(id);
            await loadData();
            ui.switchView("journal");
          } catch (err) {
            console.error("Error completing destination:", err);
          }
        }
      }
    });

  // Journals Actions
  document.getElementById("journals-list").addEventListener("click", (e) => {
    const btn = e.target;
    if (!btn.classList.contains("add-review-btn")) return;
    ui.openReviewModal(btn.dataset.id, btn.dataset.name);
  });

  // Review Modal Form
  document
    .getElementById("review-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("review-dest-id").value;
      const ratingEle = document.querySelector('input[name="rating"]:checked');
      const reviewText = document.getElementById("review-text").value;

      const data = {
        rating: ratingEle ? ratingEle.value : 0,
        reviewText: reviewText,
      };

      try {
        await api.addReview(id, data);
        ui.closeReviewModal();
        await loadData();
      } catch (err) {
        console.error("Error saving review:", err);
        alert("Error saving review. Please try again.");
      }
    });

  // Close Modal
  document
    .querySelector(".close-modal")
    .addEventListener("click", ui.closeReviewModal);

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("review-modal");
    if (e.target === modal) {
      ui.closeReviewModal();
    }
  });
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadData();
});
