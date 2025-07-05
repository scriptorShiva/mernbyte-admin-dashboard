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
};

export type Tenant = {
  id: number;
  name: string;
  address: string;
};
