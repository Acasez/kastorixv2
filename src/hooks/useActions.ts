// src/hooks/useActions.ts
import { useEffect, useState } from "react";

interface Action {
  name: string;
  actions: string;
  trigger: string;
  description: string;
  traits: string;
}

export const useActions = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await fetch("/json/actions.json");
        if (!response.ok) throw new Error("Failed to fetch actions");
        const data = await response.json();
        setActions(data);
      } catch (err) {
        setError("Failed to load actions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, []);

  return { actions, loading, error };
};
