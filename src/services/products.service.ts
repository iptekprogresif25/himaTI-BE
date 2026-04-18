import * as ProductModel from "../models/product.model.js"
import { uploadImage, deleteImage } from "../utils/image.js"

export const getProducts = async () => {
  return await ProductModel.findAll()
}

export const getProductById = async (id: string) => {

  const product = await ProductModel.findById(id)

  if (!product) {
    return null
  }

  return product
}


export const createProduct = async (
  name: string,
  description: string,
  category: string,
  url: string,
  price: number,
  image: File,
) => {

  const imageUpload = await uploadImage(image,"products")

  return await ProductModel.create({
    name,
    description,
    image_url: imageUpload.url,
    image_public_id: imageUpload.public_id,
    category,
    url,
    price
})

}

export const updateProduct = async (
  id: string,
  data: any
) => {

  const product = await ProductModel.findById(id)

  if (!product) {
    throw new Error("Product not found")
  }

  // 🔥 HANDLE IMAGE (opsional)
  if (data.image) {

    if (product.image_public_id) {
      await deleteImage(product.image_public_id)
    }

    const image = await uploadImage(data.image, "products")

    data.image_url = image.url
    data.image_public_id = image.public_id

    delete data.image // biar gak ikut ke DB
  }

  return await ProductModel.update(id, data)
}

export const deleteProduct = async (id: string) => {

  const product = await ProductModel.findById(id)

  if (!product) {
    return null
  }

  if (product.image_public_id) {
    await deleteImage(product.image_public_id)
  }

  await ProductModel.remove(id)

  return product
}

