import { useEffect, useState } from "react";
import { subscribeApiLoading } from "../services/api";

export function useApiLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeApiLoading((loading) => {
      setIsLoading(Boolean(loading));
    });
    return unsubscribe;
  }, []);

  return isLoading;
}

