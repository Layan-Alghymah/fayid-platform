// Local API client stubs — buyer flows use Supabase via hooks; admin/supplier are placeholders.

import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "buyer" | "supplier" | "admin";
  supplierId?: number | null;
  supplierStatus?: string | null;
}

export interface Product {
  id: number;
  supplierId?: number;
  supplierName?: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl?: string | null;
  discountReason?: string | null;
  sizes?: string[];
  brand?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface Order {
  id: number;
  userId: number;
  customerName?: string;
  status: string;
  totalPrice: number;
  paymentMethod?: string | null;
  shippingAddress?: string | null;
  createdAt: string;
  items?: unknown[];
}

function stubQuery<T = unknown>(): UseQueryResult<T> {
  return {
    data: undefined,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
    isFetching: false,
    refetch: async () => ({ data: undefined }),
    status: "idle",
    fetchStatus: "idle",
    isPending: false,
    isStale: false,
    isPlaceholderData: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    isFetched: false,
    isFetchedAfterMount: false,
    isRefetchError: false,
    isRefetching: false,
    isInitialLoading: false,
  } as UseQueryResult<T>;
}

function stubMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(): UseMutationResult<
  TData,
  TError,
  TVariables,
  TContext
> {
  return {
    mutate: () => {},
    mutateAsync: async () => {
      throw new Error("غير متاح — لوحة التحكم قيد التطوير");
    },
    isPending: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    status: "idle",
    failureCount: 0,
    failureReason: null,
    submittedAt: 0,
    variables: undefined as unknown as TVariables,
    context: undefined,
    data: undefined,
    error: null,
    reset: () => {},
  } as UseMutationResult<TData, TError, TVariables, TContext>;
}

export function useGetMe() {
  return stubQuery<User>();
}
export function useLogout() {
  return stubMutation();
}
export function useListProducts() {
  return stubQuery<ProductsResponse>();
}
export function useGetProduct() {
  return stubQuery<Product>();
}
export function useGetCart() {
  return stubQuery<CartResponse>();
}
export function useAddToCart() {
  return stubMutation();
}
export function useUpdateCartItem() {
  return stubMutation();
}
export function useRemoveFromCart() {
  return stubMutation();
}
export function useCreateOrder() {
  return stubMutation();
}
export function useGetAdminStats() {
  return stubQuery();
}
export function useListSuppliers() {
  return stubQuery();
}
export function useApproveSupplier() {
  return stubMutation();
}
export function useRejectSupplier() {
  return stubMutation();
}
export function useListOrders() {
  return stubQuery();
}
export function useGetOrder() {
  return stubQuery();
}
export function useUpdateOrderStatus() {
  return stubMutation();
}
export function useListUsers() {
  return stubQuery();
}
export function useListCategories() {
  return stubQuery();
}
export function useCreateCategory() {
  return stubMutation();
}
export function useUpdateCategory() {
  return stubMutation();
}
export function useDeleteCategory() {
  return stubMutation();
}
export function useListAdminOrders() {
  return stubQuery();
}
export function useListAdminProducts() {
  return stubQuery();
}
export function useAdminDeleteProduct() {
  return stubMutation();
}
export function useListNotifications() {
  return stubQuery();
}
export function useMarkNotificationRead() {
  return stubMutation();
}
export function useListProductApprovals() {
  return stubQuery();
}
export function useApproveProduct() {
  return stubMutation();
}
export function useRejectProduct() {
  return stubMutation();
}
export function useGetSupplierStats() {
  return stubQuery();
}
export function useListSupplierOrders() {
  return stubQuery();
}
export function useListSupplierProducts() {
  return stubQuery();
}
export function useCreateProduct() {
  return stubMutation();
}
export function useUpdateProduct() {
  return stubMutation();
}
export function useDeleteProduct() {
  return stubMutation();
}
export function useLogin() {
  return stubMutation();
}
export function useRegister() {
  return stubMutation();
}
