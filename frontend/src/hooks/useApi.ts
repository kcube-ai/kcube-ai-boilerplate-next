import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

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
  navigate?: ReturnType<typeof useNavigate>
): Promise<T> {
  const { route, method = "GET", isAuth = false } = config;
  const { body, queryParams } = options;

  const url = new URL(`${base_url}${route}`);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  }

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (isAuth) {
    const token = localStorage.getItem("access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // Important to send refresh cookie
  });

  // If access token is expired — try refreshing
  if ((response.status === 401 || response.status === 403) && isAuth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry original request with new token
      const newToken = localStorage.getItem("access_token");
      if (newToken) headers["Authorization"] = `Bearer ${newToken}`;
      const retryRes = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });
      if (!retryRes.ok) throw new Error("Retry failed after refresh");
      return retryRes.status === 204 ? null as T : retryRes.json();
    } else {
      navigate?.("/login");
      throw new Error("Session expired — please log in again");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error: ${response.status}`);
  }

  return response.status === 204 ? (null as T) : response.json();
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${base_url}/api/auth/refresh`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    return true;
  } catch {
    return false;
  }
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
