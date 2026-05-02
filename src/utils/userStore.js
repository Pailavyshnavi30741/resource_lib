const API_BASE_URL = "https://resourcelibrary-backend-production.up.railway.app/api/users";
const normalizeUser = (user) => ({
  ...user,
  id: String(user.id),
  name: user.name || "Unknown User",
  email: user.email || "",
  role: (user.role || "user").toLowerCase(),
});

export const getAllUsers = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Unable to fetch users.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeUser) : [];
};

export const deleteUserById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete user.");
  }
};
