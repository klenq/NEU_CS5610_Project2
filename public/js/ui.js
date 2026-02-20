export const ui = {
  // Render Stats
  renderStats(stats) {
    document.getElementById("stat-planned").textContent = stats.planned;
    document.getElementById("stat-completed").textContent = stats.completed;
    document.getElementById("stat-total").textContent = stats.total;
  },

  // Render Destinations List
  renderDestinations(destinations) {
    const list = document.getElementById("destinations-list");
    list.innerHTML = "";

    if (destinations.length === 0) {
      list.innerHTML = `
                <div class="empty-state">
                    <h3>No planned trips yet!</h3>
                    <p>Add your first dream destination using the form.</p>
                </div>
            `;
      return;
    }

    destinations.forEach((dest) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
                <h3 class="card-title">${escapeHTML(dest.name)}</h3>
                ${dest.budget ? `<span class="card-budget">$${dest.budget} Est. Budget</span>` : ""}
                <p class="card-desc">${escapeHTML(dest.description || "No description provided.")}</p>
                <div class="card-actions">
                    <button class="action-btn complete-btn" data-id="${dest._id}">Finish Trip ✔</button>
                    <button class="action-btn edit-btn" data-id="${dest._id}" data-name="${escapeHTML(dest.name)}" data-desc="${escapeHTML(dest.description)}" data-budget="${dest.budget}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${dest._id}">Delete</button>
                </div>
            `;
      list.appendChild(card);
    });
  },

  // Render Journals List
  renderJournals(journals) {
    const list = document.getElementById("journals-list");
    list.innerHTML = "";

    if (journals.length === 0) {
      list.innerHTML = `
                <div class="empty-state">
                    <h3>No finished trips yet.</h3>
                    <p>Complete a planned trip to start journaling your memories!</p>
                </div>
            `;
      return;
    }

    journals.forEach((journal) => {
      const card = document.createElement("div");
      card.className = "card completed-card";

      // Build rating stars
      let ratingHTML = "";
      if (journal.rating) {
        ratingHTML = `<div class="rating-display">${"★".repeat(journal.rating)}${"☆".repeat(5 - journal.rating)}</div>`;
      }

      // Build review text
      let reviewHTML = "";
      if (journal.reviewText) {
        reviewHTML = `
                    <div class="journal-text">"${escapeHTML(journal.reviewText)}"</div>
                    <span class="journal-date">Reviewed on ${new Date(journal.reviewedAt).toLocaleDateString()}</span>
                `;
      } else {
        reviewHTML = `<button class="btn btn-secondary w-100 add-review-btn" data-id="${journal._id}" data-name="${escapeHTML(journal.name)}">Write a Review</button>`;
      }

      card.innerHTML = `
                <h3 class="card-title">${escapeHTML(journal.name)}</h3>
                <span class="card-budget">Completed</span>
                ${ratingHTML}
                ${reviewHTML}
            `;
      list.appendChild(card);
    });
  },

  // View Switching
  switchView(viewName) {
    const views = {
      bucketlist: document.getElementById("view-bucketlist"),
      journal: document.getElementById("view-journal"),
    };

    const navBtns = {
      bucketlist: document.getElementById("nav-bucketlist"),
      journal: document.getElementById("nav-journal"),
    };

    // Hide all views, remove active from all navs
    Object.values(views).forEach((v) => v.classList.add("hidden"));
    Object.values(navBtns).forEach((b) => b.classList.remove("active"));

    // Show selected
    views[viewName].classList.remove("hidden");
    navBtns[viewName].classList.add("active");
  },

  // Form Handling
  setFormEditing(isEditing, data = null) {
    const formTitle = document.getElementById("form-title");
    const btnSubmit = document.getElementById("btn-submit-dest");
    const btnCancel = document.getElementById("btn-cancel-edit");
    const idInput = document.getElementById("dest-id");
    const nameInput = document.getElementById("dest-name");
    const budgetInput = document.getElementById("dest-budget");
    const descInput = document.getElementById("dest-desc");

    if (isEditing && data) {
      formTitle.textContent = "Edit Destination";
      btnSubmit.textContent = "Update Destination";
      btnCancel.classList.remove("hidden");

      idInput.value = data.id;
      nameInput.value = data.name;
      budgetInput.value = data.budget !== "null" ? data.budget : "";
      descInput.value = data.desc !== "null" ? data.desc : "";
      nameInput.focus();
    } else {
      formTitle.textContent = "Add New Destination";
      btnSubmit.textContent = "Save Destination";
      btnCancel.classList.add("hidden");

      idInput.value = "";
      document.getElementById("destination-form").reset();
    }
  },

  // Modal Handling
  openReviewModal(id, title) {
    const modal = document.getElementById("review-modal");
    document.getElementById("modal-title").textContent = `Review: ${title}`;
    document.getElementById("review-dest-id").value = id;
    document.getElementById("review-form").reset();
    modal.classList.remove("hidden");
  },

  closeReviewModal() {
    document.getElementById("review-modal").classList.add("hidden");
  },
};

// Helper for basic XSS prevention
function escapeHTML(str) {
  if (!str) return "";
  return str
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
