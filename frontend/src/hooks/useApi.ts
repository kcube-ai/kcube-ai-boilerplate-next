import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

interface ApiConfig {
  route: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  isAuth?: boolean;
}

interface FetchOptions {
  body?: any;
  queryParams?: Record<string, string | number | boolean>;
}

async function fetcher<T>(
  config: ApiConfig,
  options: FetchOptions = {},
  navigate?: ReturnType<typeof useNavigate> // add optional navigate
): Promise<T> {
  const { route, method = "GET", isAuth = false } = config;
  const { body, queryParams } = options;

  // Build full URL with query params
  console.log(`${base_url}${route}`)
  const url = new URL(`${base_url}${route}`);
  console.log(url)
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (isAuth) {
    const token = localStorage.getItem("access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle redirects if navigate is available
  if (navigate) {
    if (res.status === 403) {
      navigate("/login");
      throw new Error("Forbidden: Redirecting to login");
    }

    if (res.status === 428) {
      navigate("/verify");
      throw new Error("Precondition Required: Redirecting to verification");
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * useApiQuery - for GET requests
 */
export function useApiQuery<T>(
  config: ApiConfig,
  options?: FetchOptions,
  queryOptions?: Partial<UseQueryOptions<T, Error>>
) {
  const navigate = useNavigate();
  const queryFn = () => fetcher<T>(config, options, navigate);
  return useQuery<T, Error>({
    queryKey: [config.route, options],
    queryFn,
    ...queryOptions,
  });
}

/**
 * useApiMutation - for POST/PUT/PATCH/DELETE requests
 */
export function useApiMutation<T, TVariables = any>(
  config: ApiConfig,
  mutationOptions?: UseMutationOptions<T, Error, TVariables>
) {
  const navigate = useNavigate();
  const mutateFn = (variables: TVariables) =>
    fetcher<T>(config, { body: variables }, navigate);

  return useMutation<T, Error, TVariables>({
    mutationFn: mutateFn,
    ...mutationOptions,
  });
}
