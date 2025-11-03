import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiQuery, useApiMutation } from "../../hooks/useApi";

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  role: string;
  updated_at: string;
  created_at: string;
}

interface UserEditRequest {
  first_name: string;
  last_name: string;
  bio: string;
}

const UserSettings = () => {
  const navigate = useNavigate();

  // Fetch current user data
  const { data: userData, isLoading, refetch } = useApiQuery<UserData>(
    { route: "/api/users/me", isAuth: true },
    {},
    { retry: 1 }
  );

  // Local state for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Success/error messages
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Populate form when user data loads
  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setBio(userData.bio || "");
    }
  }, [userData]);

  // Update profile mutation
  const updateProfileMutation = useApiMutation<{ message: string; user: UserData }, UserEditRequest>(
    { route: "/api/users/me", method: "PUT", isAuth: true },
    {
      onSuccess: () => {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        refetch();
        setTimeout(() => setProfileMessage(null), 5000);
      },
      onError: (error) => {
        setProfileMessage({ type: 'error', text: error.message });
        setTimeout(() => setProfileMessage(null), 5000);
      }
    }
  );

  // Password reset mutation
  const passwordResetMutation = useApiMutation<{ message: string }, { email: string }>(
    { route: "/api/auth/request-password-reset", method: "POST" },
    {
      onSuccess: () => {
        setPasswordMessage({ type: 'success', text: 'Password reset link sent to your email!' });
        setTimeout(() => setPasswordMessage(null), 5000);
      },
      onError: (error) => {
        setPasswordMessage({ type: 'error', text: error.message });
        setTimeout(() => setPasswordMessage(null), 5000);
      }
    }
  );

  // Email change mutation
  const emailChangeMutation = useApiMutation<{ message: string }, { new_email: string }>(
    { route: "/api/auth/request-email-change", method: "POST", isAuth: true },
    {
      onSuccess: () => {
        setEmailMessage({ type: 'success', text: 'Verification link sent to new email address!' });
        setNewEmail("");
        setTimeout(() => setEmailMessage(null), 5000);
      },
      onError: (error) => {
        setEmailMessage({ type: 'error', text: error.message });
        setTimeout(() => setEmailMessage(null), 5000);
      }
    }
  );

  // Delete account mutation
  const deleteAccountMutation = useApiMutation<void, void>(
    { route: "/api/users/me", method: "DELETE", isAuth: true },
    {
      onSuccess: () => {
        localStorage.removeItem("access_token");
        navigate("/login");
      },
      onError: (error) => {
        alert(`Failed to delete account: ${error.message}`);
        setShowDeleteConfirm(false);
      }
    }
  );

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      first_name: firstName,
      last_name: lastName,
      bio: bio
    });
  };

  const handlePasswordReset = () => {
    if (userData?.email) {
      passwordResetMutation.mutate({ email: userData.email });
    }
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail) {
      emailChangeMutation.mutate({ new_email: newEmail });
    }
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-t-transparent border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text px-4 py-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-text mb-8">Account Settings</h1>

        {/* Section 1: Theme Settings */}
        <div className="bg-surface border border-border rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-text mb-4">Theme Preferences</h2>
          <p className="text-text/60 text-sm">Theme customization coming soon...</p>
        </div>

        {/* Section 2: Profile Information */}
        <div className="bg-surface border border-border rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-text mb-4">Profile Information</h2>

          {profileMessage && (
            <div className={`mb-4 p-3 rounded-md ${profileMessage.type === 'success' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'}`}>
              {profileMessage.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-text mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-background border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full bg-button hover:opacity-90 text-buttonText px-4 py-2 rounded-md transition-opacity disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Section 3: Password Reset */}
        <div className="bg-surface border border-border rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-text mb-4">Change Password</h2>

          {passwordMessage && (
            <div className={`mb-4 p-3 rounded-md ${passwordMessage.type === 'success' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'}`}>
              {passwordMessage.text}
            </div>
          )}

          <p className="text-text/70 text-sm mb-4">
            We'll send a password reset link to your email: <span className="font-medium">{userData?.email}</span>
          </p>

          <button
            onClick={handlePasswordReset}
            disabled={passwordResetMutation.isPending}
            className="w-full bg-button hover:opacity-90 text-buttonText px-4 py-2 rounded-md transition-opacity disabled:opacity-50"
          >
            {passwordResetMutation.isPending ? "Sending..." : "Request Password Reset"}
          </button>
        </div>

        {/* Section 4: Email Change */}
        <div className="bg-surface border border-border rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-text mb-4">Change Email</h2>

          {emailMessage && (
            <div className={`mb-4 p-3 rounded-md ${emailMessage.type === 'success' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'}`}>
              {emailMessage.text}
            </div>
          )}

          <p className="text-text/70 text-sm mb-4">
            Current email: <span className="font-medium">{userData?.email}</span>
          </p>

          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-text mb-1">
                New Email Address
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                placeholder="Enter new email address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={emailChangeMutation.isPending}
              className="w-full bg-button hover:opacity-90 text-buttonText px-4 py-2 rounded-md transition-opacity disabled:opacity-50"
            >
              {emailChangeMutation.isPending ? "Sending..." : "Request Email Change"}
            </button>
          </form>
        </div>

        {/* Section 5: Delete Account */}
        <div className="bg-surface border border-border rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

          <p className="text-text/70 text-sm mb-4">
            Once you delete your account, there is no going back. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4">
                <p className="text-red-600 font-medium mb-2">Are you absolutely sure?</p>
                <p className="text-text/70 text-sm">
                  This will permanently delete your account and all associated data.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-background border border-border hover:bg-surface text-text px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountMutation.isPending}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {deleteAccountMutation.isPending ? "Deleting..." : "Yes, Delete My Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
