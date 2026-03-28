import z from 'zod'

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  brand: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
  sku: z.string(),
  price: z.number().optional(),
  rating: z.number().optional(),
})

export type Product = z.infer<typeof productSchema>
