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

export type PriceConfigurationOption = {
  priceType: "base" | "additional";
  availableOptions: string[];
  _id: string;
};

export type Attribute = {
  name: string;
  widgetType: "switch" | "radio" | "text" | "select";
  defaultValue: string;
  availableOptions: string[];
  _id: string;
};

export type Category = {
  _id: string;
  name: string;
  priceConfiguration: {
    [key: string]: PriceConfigurationOption; //The object can have any number of keys.
  };
  attributes: Attribute[];
  createdAt: string;
  updatedAt: string;
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
