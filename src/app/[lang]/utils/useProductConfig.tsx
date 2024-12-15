import { create } from 'zustand'

export interface Products {
  products: ProductProperties[]
}
export interface ProductProperties {
  productId: string
  productName: string
  productImageSrc: string
  productImageAlt: string
  productSeries: string
  productStyle: string
  productDescription: string
  productPrice: string
  productCompareId: string
  cardType: string
  whishListBtnText: string
  slug: string
}

export interface Product {
  selecteProduct: ProductProperties
}

interface UpdateProductConfig extends Products {
    updateProductConfig: (config: Products) => void,
}

interface UpdateSelectedProduct extends Product {
  updateSelectedProduct: (config: Product) => void
}

export const useProductConfig = create<UpdateProductConfig>((set) => ({
  products:[],
  updateProductConfig: (param: Products) => set((state) => ({products: param.products}))
}))

export const useSelectedProduct = create<UpdateSelectedProduct>((set) => ({
  selecteProduct: {} as ProductProperties,
  updateSelectedProduct: (param: Product) => set((state) => ({selecteProduct: param.selecteProduct}))
}))