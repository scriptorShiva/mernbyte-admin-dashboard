import { CreateUserData, Credentials } from "../types";
import { api } from "./client";

//Auth Service
export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");

export const logout = () => api.post("/auth/logout");

export const getUsers = (queryString: string) =>
  api.get("/users?" + queryString);

export const getTenants = () => api.get("/tenants");

export const createUser = (user: CreateUserData) => api.post("/users", user);

export const updateUser = (id: string, user: CreateUserData) =>
  api.patch(`/users/${id}`, user);

export const deleteUser = (id: string) => api.delete(`/users/${id}`);
