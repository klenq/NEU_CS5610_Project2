const BASE_URL = "/api";

export const api = {
  // Destinations API
  async getDestinations() {
    const res = await fetch(`${BASE_URL}/destinations`);
    if (!res.ok) throw new Error("Failed to fetch destinations");
    return res.json();
  },

  async createDestination(data) {
    const res = await fetch(`${BASE_URL}/destinations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create destination");
    return res.json();
  },

  async updateDestination(id, data) {
    const res = await fetch(`${BASE_URL}/destinations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update destination");
    return res.json();
  },

  async deleteDestination(id) {
    const res = await fetch(`${BASE_URL}/destinations/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete destination");
    return res.json();
  },

  async completeDestination(id) {
    const res = await fetch(`${BASE_URL}/destinations/${id}/complete`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to complete destination");
    return res.json();
  },

  // Journals API
  async getJournals() {
    const res = await fetch(`${BASE_URL}/journals`);
    if (!res.ok) throw new Error("Failed to fetch journals");
    return res.json();
  },

  async addReview(id, data) {
    const res = await fetch(`${BASE_URL}/journals/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add review");
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/journals/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },
};
