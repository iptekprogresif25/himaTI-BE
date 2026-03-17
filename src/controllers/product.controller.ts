import type { Context } from "hono"
import * as productService from "../services/products.service.js"

export const getAll = async (c: Context) => {
  try {

    const products = await productService.getProducts()

    return c.json(products)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const getOne = async (c: Context) => {
  try {

    const id = c.req.param("id")

    if (!id) {
      return c.json({ message: "ID is required" }, 400)
    }

    const product = await productService.getProductById(id)

    if (!product) {
      return c.json({ message: "Product not found" }, 404)
    }

    return c.json(product)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const create = async (c: Context) => {
  try {

    const body = await c.req.parseBody()

    const product = await productService.createProduct(
      body.name as string,
      body.description as string,
      body.category as string,
      body.image as File
    )

    return c.json(product, 201)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const update = async (c: Context) => {
  try {

    const id = c.req.param("id")

    if (!id) {
      return c.json({ message: "ID is required" }, 400)
    }

    const body = await c.req.parseBody()

    const product = await productService.updateProduct(id, body)

    if (!product) {
      return c.json({ message: "Product not found" }, 404)
    }

    return c.json(product)

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}

export const remove = async (c: Context) => {
  try {

    const id = c.req.param("id")

    if (!id) {
      return c.json({ message: "ID is required" }, 400)
    }

    const product = await productService.deleteProduct(id)

    if (!product) {
      return c.json({ message: "Product not found" }, 404)
    }

    return c.json({
      message: "Product deleted successfully"
    })

  } catch (err) {

    console.error(err)

    return c.json({
      message: "Internal Server Error"
    }, 500)

  }
}