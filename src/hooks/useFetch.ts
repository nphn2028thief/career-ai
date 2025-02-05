/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T>(callback: (...args: any) => Promise<any>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);

  const fn = async (...args: any): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callback(...args);
      setData(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fn, setData };
};

export default useFetch;
