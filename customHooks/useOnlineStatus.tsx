import { useState, useEffect } from "react";

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true); // Default to true for SSR

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return isOnline;
}
