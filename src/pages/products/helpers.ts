import { Products } from "../../types";

export const makeFormDataForServer = (data: Products) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "image") {
      if (Array.isArray(value) && value[0]?.originFileObj instanceof File) {
        formData.append(key, value[0].originFileObj);
      }
    } else if (key === "attributes" || key === "priceConfiguration") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value as string);
    }
  });

  return formData;
};
