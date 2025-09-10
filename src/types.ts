export type Credentials = {
  email: string;
  password: string;
};

export type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  tenant?: Tenant;
};

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tenantId: number;
};

export type Tenant = {
  id?: number;
  name: string;
  address: string;
};

export type Category = {
  _id: string;
  name: string;
};

export type Products = {
  _id: string;
  name: string;
  description: string;
  category: Category;
  isPublished: boolean;
  imageUrl: string;
  createdAt?: string;
};
