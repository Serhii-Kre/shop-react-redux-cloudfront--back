export interface Product {
    description: string;
    title: string;
    id: string;
    price: number;
    imageName: string;
  }
  
  export interface Stock {
    id: string;
    count: number;
  }
  
  export type ProductList = Array<Product>;
  
  export type AvailableProduct = Product & Stock;
  
  export interface CreateProductBody {
    description: string;
    title: string;
    price: number;
    count?: number;
  }