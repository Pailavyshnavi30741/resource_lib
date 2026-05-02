import { useEffect, useState } from "react";
import UserLayout from "../../components/user/UserLayout";
import { useAuth } from "../../context/AuthContext";
import "../../styles/user.css";

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    nickName: "",
    gender: "Male",
    country: "",
    language: "",
    timeZone: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setFormData({
      fullName: currentUser.name || "",
      nickName: currentUser.nickName || currentUser.name?.split(" ")[0] || "",
      gender: currentUser.gender || "Male",
      country: currentUser.country || "",
      language: currentUser.language || "",
      timeZone: currentUser.timeZone || "",
      email: currentUser.email || "",
      role: currentUser.role || "user",
    });
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    try {
      updateProfile({
        name: formData.fullName.trim(),
        nickName: formData.nickName.trim(),
        gender: formData.gender,
        country: formData.country.trim(),
        language: formData.language.trim(),
        timeZone: formData.timeZone.trim(),
      });
      alert("Profile Updated Successfully");
      setIsEditing(false);
    } catch (error) {
      alert(error.message || "Unable to update profile");
    }
  };

  const displayName = formData.fullName || "User";

  return (
    <UserLayout>
      <div className="profile-container">
        <div className="profile-header">
          <h2>Welcome, {displayName.split(" ")[0]}</h2>
          <p>Manage your profile information</p>
        </div>

        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">{displayName.charAt(0).toUpperCase()}</div>

            <div>
              <h3>{displayName}</h3>
              <p>{formData.email}</p>
              <p>Role: {formData.role}</p>
            </div>

            <button
              className="edit-btn-profile"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="profile-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Nick Name</label>
              <input
                type="text"
                name="nickName"
                value={formData.nickName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Time Zone</label>
              <input
                type="text"
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="text" value={formData.email} readOnly />
            </div>
          </div>

          <button
            className="save-profile-btn"
            onClick={handleSave}
            disabled={!isEditing}
          >
            Save Changes
          </button>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
