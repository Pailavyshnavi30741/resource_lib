const API_BASE_URL = "https://resourcelibrary-backend-production.up.railway.app/api/resources";
const normalizeText = (value = "") => value.trim().toLowerCase();

const normalizeResource = (resource) => ({
  ...resource,
  id: String(resource.id),
  subject: resource.subject || "General",
  type: resource.type || "File",
  fileUrl: resource.fileUrl || "",
  uploaderId:
    resource.uploaderId ??
    resource.uploadedById ??
    resource.createdById ??
    resource.ownerId ??
    null,
  uploaderEmail:
    resource.uploaderEmail ??
    resource.uploadedByEmail ??
    resource.createdByEmail ??
    resource.ownerEmail ??
    resource.email ??
    "",
  uploaderName:
    resource.uploaderName ??
    resource.uploadedByName ??
    resource.createdByName ??
    resource.ownerName ??
    resource.author ??
    "",
});

export const getAllResources = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Unable to fetch resources.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeResource) : [];
};

export const getResourceById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Unable to fetch resource.");
  }

  const data = await response.json();
  return data ? normalizeResource(data) : null;
};

export const saveUploadedResource = async ({
  title,
  subject,
  type,
  file,
  uploaderId,
  uploaderEmail,
  uploaderName,
}) => {
  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("subject", subject);
  formData.append("type", type.trim());
  formData.append("file", file);
  if (uploaderId != null && uploaderId !== "") {
    formData.append("uploaderId", String(uploaderId));
  }
  if (uploaderEmail) {
    formData.append("uploaderEmail", uploaderEmail.trim());
  }
  if (uploaderName) {
    formData.append("uploaderName", uploaderName.trim());
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed.");
  }

  return normalizeResource(await response.json());
};

export const updateResourceById = async (
  id,
  { title, subject, type, file, uploaderId, uploaderEmail, uploaderName }
) => {
  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("subject", subject);
  formData.append("type", type.trim());
  if (file) {
    formData.append("file", file);
  }
  if (uploaderId != null && uploaderId !== "") {
    formData.append("uploaderId", String(uploaderId));
  }
  if (uploaderEmail) {
    formData.append("uploaderEmail", uploaderEmail.trim());
  }
  if (uploaderName) {
    formData.append("uploaderName", uploaderName.trim());
  }

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Unable to update resource.");
  }

  return normalizeResource(await response.json());
};

export const deleteResourceById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete resource.");
  }
};

export const isResourceOwnedByUser = (resource, user) => {
  if (!resource || !user) {
    return false;
  }

  const resourceOwnerId = resource.uploaderId == null ? "" : String(resource.uploaderId);
  const userId = user.id == null ? "" : String(user.id);
  const resourceOwnerEmail = normalizeText(resource.uploaderEmail);
  const userEmail = normalizeText(user.email);
  const resourceOwnerName = normalizeText(resource.uploaderName);
  const userName = normalizeText(user.name);
  const hasOwnershipMetadata = Boolean(
    resourceOwnerId || resourceOwnerEmail || resourceOwnerName
  );

  if (!hasOwnershipMetadata && user.role === "admin") {
    return true;
  }

  return (
    (resourceOwnerId && userId && resourceOwnerId === userId) ||
    (resourceOwnerEmail && userEmail && resourceOwnerEmail === userEmail) ||
    (resourceOwnerName && userName && resourceOwnerName === userName)
  );
};
