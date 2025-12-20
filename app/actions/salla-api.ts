"use server";

const SALLA_API_BASE = "https://api.salla.dev/admin/v2";

interface SallaPagination {
  count: number;
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  links: {
    next: string | null;
    previous: string | null;
  };
}

interface SallaApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
  pagination?: SallaPagination;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

/**
 * Fetch Products from Salla
 */
export async function getSallaProducts(accessToken: string, page: number = 1, keyword?: string) {
  try {
    let url = `${SALLA_API_BASE}/products?page=${page}`;
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("[SallaAPI] Get products failed:", result);
        throw new Error(result.error?.message || "Failed to fetch products");
    }

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error: any) {
    console.error("[SallaAPI] Get products error:", error);
    return {
      success: false,
      error: error.message || "An error occurred fetching products",
    };
  }
}

/**
 * Fetch Orders from Salla
 */
export async function getSallaOrders(accessToken: string, page: number = 1) {
  try {
    const response = await fetch(`${SALLA_API_BASE}/orders?page=${page}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("[SallaAPI] Get orders failed:", result);
        throw new Error(result.error?.message || "Failed to fetch orders");
    }

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error: any) {
    console.error("[SallaAPI] Get orders error:", error);
    return {
      success: false,
      error: error.message || "An error occurred fetching orders",
    };
  }
}

/**
 * Fetch Customers from Salla
 */
export async function getSallaCustomers(accessToken: string, page: number = 1) {
  try {
    const response = await fetch(`${SALLA_API_BASE}/customers?page=${page}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("[SallaAPI] Get customers failed:", result);
        throw new Error(result.error?.message || "Failed to fetch customers");
    }

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error: any) {
    console.error("[SallaAPI] Get customers error:", error);
    return {
      success: false,
      error: error.message || "An error occurred fetching customers",
    };
  }
}
