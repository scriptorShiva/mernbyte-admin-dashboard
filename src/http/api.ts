import { CreateUserData, Credentials } from "../types";
import { api } from "./client";

//Auth Service
export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");

// User Service
export const getUsers = (queryString: string) =>
  api.get("/users?" + queryString);
export const createUser = (user: CreateUserData) => api.post("/users", user);
export const updateUser = (id: string, user: CreateUserData) =>
  api.patch(`/users/${id}`, user);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

// Tenant Service
export const getTenants = (queryString: string) =>
  api.get("/tenants?" + queryString);
export const createTenant = (tenant: any) => api.post("/tenants", tenant);
export const updateTenant = (id: string, tenant: any) =>
  api.patch(`/tenants/${id}`, tenant);
export const deleteTenant = (id: string) => api.delete(`/tenants/${id}`);
