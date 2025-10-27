import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse tokens from query string
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Store tokens (use secure cookies in production)
      localStorage.setItem("access_token", accessToken);

      // Optionally clear query params from URL
      window.history.replaceState({}, document.title, "/");

      // Redirect user to chat
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-medium">Signing you in...</p>
    </div>
  );
};

export default OAuthSuccess;
