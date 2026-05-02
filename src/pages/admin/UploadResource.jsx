import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getResourceById,
  isResourceOwnedByUser,
  saveUploadedResource,
  updateResourceById,
} from "../../utils/resourceStore";
import "../../styles/admin.css";

const defaultFormData = {
  title: "",
  subject: "Coding",
  type: "PDF",
  file: null,
};

const UploadResource = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const isEditMode = useMemo(() => Boolean(id), [id]);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResource, setIsLoadingResource] = useState(isEditMode);
  const [uploadMessage, setUploadMessage] = useState("");
  const [resourceOwnerError, setResourceOwnerError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      setIsLoadingResource(false);
      setResourceOwnerError("");
      setFormData(defaultFormData);
      return;
    }

    const loadResource = async () => {
      try {
        setIsLoadingResource(true);
        setUploadMessage("");
        setResourceOwnerError("");

        const resource = await getResourceById(id);

        if (!resource) {
          setResourceOwnerError("This resource could not be found.");
          return;
        }

        if (!isResourceOwnedByUser(resource, currentUser)) {
          setResourceOwnerError("You can edit only the resources uploaded by your admin account.");
          return;
        }

        setFormData({
          title: resource.title || "",
          subject: resource.subject || "Coding",
          type: resource.type || "PDF",
          file: null,
        });
      } catch (error) {
        console.error(error);
        setResourceOwnerError(error.message || "Unable to load this resource for editing.");
      } finally {
        setIsLoadingResource(false);
      }
    };

    loadResource();
  }, [currentUser, id, isEditMode]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "file") {
      setFormData((currentData) => ({ ...currentData, file: files?.[0] || null }));
      return;
    }

    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setUploadMessage("");

    try {
      const payload = {
        ...formData,
        uploaderId: currentUser?.id || "",
        uploaderEmail: currentUser?.email || "",
        uploaderName: currentUser?.name || "",
      };

      if (isEditMode) {
        await updateResourceById(id, payload);
      } else {
        await saveUploadedResource(payload);
      }

      setFormData(defaultFormData);
      setUploadMessage(
        isEditMode
          ? "Resource updated successfully. The new category and details are now saved."
          : "Resource uploaded successfully. Users can now find it in Search, and the dashboard will continue showing only 4-5 resources."
      );

      if (isEditMode) {
        window.setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1200);
      }
    } catch (error) {
      console.error(error);
      setUploadMessage(
        error.message || (isEditMode ? "Unable to update resource." : "Unable to upload resource.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-wrapper">
        <div className="admin-container">
          <h2 className="page-title">{isEditMode ? "Edit Resource" : "Upload New Resource"}</h2>
          <p className="page-subtitle">
            {isEditMode
              ? "Update the title, category, type, or replace the file for a resource you uploaded."
              : "Add a new learning resource for users to discover."}
          </p>
          {uploadMessage && <p className="upload-status-message">{uploadMessage}</p>}
          {resourceOwnerError && <p className="no-data">{resourceOwnerError}</p>}
          {isLoadingResource && <p className="no-data">Loading resource details...</p>}

          {!isLoadingResource && !resourceOwnerError && (
            <form onSubmit={handleSubmit}>

            {/* ===== BASIC INFO CARD ===== */}
            <div className="card-section">
              <h3>Basic Information</h3>

              <input
                type="text"
                name="title"
                placeholder="Resource Title"
                value={formData.title}
                onChange={handleChange}
                className="admin-input"
                required
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="admin-select"
              >
                <option>Coding</option>
                <option>Business</option>
                <option>Mathematics</option>
                <option>Languages</option>
                <option>Aptitude</option>
                <option>Human Resources</option>
              </select>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="admin-select"
              >
                <option>PDF</option>
                <option>DOCX</option>
                <option>PPT</option>
                <option>Video</option>
                <option>Image</option>
                <option>Link</option>
              </select>
            </div>

            {/* ===== FILE UPLOAD CARD ===== */}
            <div className="card-section">
              <h3>{isEditMode ? "Replace File (Optional)" : "Upload File"}</h3>

              <div className="upload-box">
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  required={!isEditMode}
                />
                <p>
                  {isEditMode
                    ? "Select a new file only if you want to replace the current one."
                    : "Drag & Drop file here or click to upload"}
                </p>
              </div>

              {formData.file && (
                <p className="file-preview">
                  📁 {formData.file.name}
                </p>
              )}
            </div>

            <div className="admin-form-actions">
              {isEditMode && (
                <Link to="/admin/dashboard" className="secondary-btn">
                  Cancel
                </Link>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Saving..."
                    : "Uploading..."
                  : isEditMode
                    ? "Save Changes"
                    : "Publish Resource"}
              </button>
            </div>

          </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadResource;
