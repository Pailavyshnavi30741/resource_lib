const API_BASE_URL = "https://resourcelibrary-backend-production.up.railway.app/api/feedback";
const normalizeFeedback = (feedback) => ({
  ...feedback,
  id: String(feedback.id),
  name: feedback.name || "Anonymous",
  email: feedback.email || "",
  resourceId: feedback.resourceId == null ? null : String(feedback.resourceId),
  resourceTitle: feedback.resourceTitle || "",
  rating: Number(feedback.rating || 0),
  message: feedback.message || "",
});

export const getAllFeedback = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Unable to fetch feedback.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeFeedback) : [];
};

export const submitFeedback = async ({
  name,
  email,
  resourceId = null,
  resourceTitle = "",
  rating,
  message,
}) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      resourceId,
      resourceTitle: resourceTitle.trim(),
      rating,
      message: message.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to submit feedback.");
  }

  return normalizeFeedback(await response.json());
};

export const getFeedbackForResource = async (resourceId) => {
  const allFeedback = await getAllFeedback();
  return allFeedback.filter((item) => item.resourceId === String(resourceId));
};

export const getAverageRating = (feedbackItems) => {
  if (!feedbackItems.length) {
    return 0;
  }

  const total = feedbackItems.reduce((sum, item) => sum + item.rating, 0);
  return total / feedbackItems.length;
};
