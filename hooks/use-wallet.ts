import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: walletApi.getWallet,
    staleTime: 30_000,
  });
}

export function useFundWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletApi.fundWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletApi.withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
