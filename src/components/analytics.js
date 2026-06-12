const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const trackClick = async (buttonName) => {
  try {
    await fetch(`${API_URL}/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ button: buttonName }),
    });
  } catch (error) {
    console.error("Analytics track error:", error);
  }
};