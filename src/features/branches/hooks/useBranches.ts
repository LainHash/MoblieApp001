import { useCallback, useEffect, useState } from 'react';
import { sessionStorage } from '@/core/storage';
import { branchService } from '../services/branch.service';
import { BranchResponse } from '../types';

export function useBranches() {
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [activeBranch, setActiveBranch] = useState<BranchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await branchService.getBranches({ pageSize: 50 });
      const items = res.data || [];
      setBranches(items);

      if (items.length > 0) {
        const storedBranchId = await sessionStorage.getActiveBranchId();
        const matched = items.find((b) => b.id === storedBranchId);
        const selected = matched || items[0];
        setActiveBranch(selected);
        if (!matched && selected) {
          await sessionStorage.setActiveBranchId(selected.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách chi nhánh');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await branchService.getBranches({ pageSize: 50 });
        const items = res.data || [];
        if (!ignore) {
          setBranches(items);
          setError(null);
          if (items.length > 0) {
            const storedBranchId = await sessionStorage.getActiveBranchId();
            const matched = items.find((b) => b.id === storedBranchId);
            const selected = matched || items[0];
            setActiveBranch(selected);
            if (!matched && selected) {
              await sessionStorage.setActiveBranchId(selected.id);
            }
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách chi nhánh');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const selectBranch = async (branch: BranchResponse) => {
    setActiveBranch(branch);
    await sessionStorage.setActiveBranchId(branch.id);
  };

  return {
    branches,
    activeBranch,
    isLoading,
    error,
    selectBranch,
    refetch: fetchBranches,
  };
}
