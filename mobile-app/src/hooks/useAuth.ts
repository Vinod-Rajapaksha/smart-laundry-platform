import { useAppSelector } from "./useAppSelector";

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    role: auth.user?.role || null,
  };
};