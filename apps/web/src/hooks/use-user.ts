import { useSimpleAuth } from "@/lib/client-simple-auth";

export const useUser = () => {
  const { user } = useSimpleAuth();

  return user;
};
