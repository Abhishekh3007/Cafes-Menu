'use client'

import { useState, useEffect } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
}

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    isOpen: false,
    total: 0
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sonnas-cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(prev => ({
        ...prev,
        items: parsedCart.items || [],
        total: calculateTotal(parsedCart.items || [])
      }))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sonnas-cart', JSON.stringify({
      items: cart.items,
      total: cart.total
    }))
  }, [cart.items, cart.total])

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const addToCart = (item: { id: number; name: string; price: number; image: string }) => {
    setCart(prev => {
      const existingItem = prev.items.find(cartItem => cartItem.id === item.id)
      
      let newItems: CartItem[]
      if (existingItem) {
        newItems = prev.items.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        newItems = [...prev.items, { ...item, quantity: 1 }]
      }

      return {
        ...prev,
        items: newItems,
        total: calculateTotal(newItems)
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.id !== id)
      return {
        ...prev,
        items: newItems,
        total: calculateTotal(newItems)
      }
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(prev => {
      const newItems = prev.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      return {
        ...prev,
        items: newItems,
        total: calculateTotal(newItems)
      }
    })
  }

  const clearCart = () => {
    setCart({
      items: [],
      isOpen: false,
      total: 0
    })
  }

  const toggleCart = () => {
    setCart(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }))
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
