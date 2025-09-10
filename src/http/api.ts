import { CreateUserData, Credentials, Tenant } from "../types";
import { api } from "./client";

// CONSTANTS : FOR KONG GATEWAY
export const AUTH_SERVICE = `/kong/api/auth`;
export const CATALOG_SERVICE = `/kong/api/catalog`;

//Auth Service
export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);

// Auth Service
// a. User Service
export const getUsers = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/users?` + queryString);
export const createUser = (user: CreateUserData) =>
  api.post(`${AUTH_SERVICE}/users`, user);
export const updateUser = (id: string, user: CreateUserData) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const deleteUser = (id: string) =>
  api.delete(`${AUTH_SERVICE}/users/${id}`);

// b. Tenant Service
export const getTenants = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/tenants?` + queryString);
export const createTenant = (tenant: Tenant) =>
  api.post(`${AUTH_SERVICE}/tenants`, tenant);
export const updateTenant = (id: string, tenant: Tenant) =>
  api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant);
export const deleteTenant = (id: string) =>
  api.delete(`${AUTH_SERVICE}/tenants/${id}`);

// Catalog Service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryString: string) =>
  api.get(`${CATALOG_SERVICE}/products?` + queryString);
