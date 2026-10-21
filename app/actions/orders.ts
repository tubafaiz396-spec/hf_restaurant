'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { z } from 'zod'

const catalog = {
  1: { name: 'Smoky HF Burger', price: 12.5 },
  2: { name: 'Tandoori Chicken Wrap', price: 10.5 },
  3: { name: 'Golden Crunch Wings', price: 11 },
  4: { name: 'Loaded HF Fries', price: 7.5 },
  5: { name: 'Mango Cream Lassi', price: 5.5 },
  6: { name: 'Chocolate Lava Cake', price: 8 },
} as const

const orderInput = z.object({
  customerName: z.string().trim().min(2).max(80),
  customerPhone: z.string().trim().min(7).max(30),
  deliveryAddress: z.string().trim().min(8).max(240),
  items: z.array(z.object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive().max(20),
  })).min(1).max(30),
})

export async function createOrder(input: unknown) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  const parsed = orderInput.parse(input)
  const items = parsed.items.map((item) => {
    const product = catalog[item.id as keyof typeof catalog]
    if (!product) throw new Error('Invalid menu item')
    return { ...product, id: item.id, quantity: item.quantity }
  })
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const [order] = await db.insert(orders).values({
    userId: session.user.id,
    customerName: parsed.customerName,
    customerPhone: parsed.customerPhone,
    deliveryAddress: parsed.deliveryAddress,
    paymentMethod: 'cash_on_delivery',
    status: 'received',
    items,
    total: total.toFixed(2),
  }).returning({ id: orders.id })

  return { id: order.id, total }
}
