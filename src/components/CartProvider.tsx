'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

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
  addToCart: (item: { id: number; name: string; price: number; image: string }) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  toggleCart: () => void
  clearCart: () => void
}

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);

  // Close cart when navigating to checkout page
  useEffect(() => {
    if (pathname === '/checkout') {
      setIsOpen(false);
    }
  }, [pathname])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sonnas-cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      const loadedItems = parsedCart.items || [];
      setItems(loadedItems);
      setTotal(calculateTotal(loadedItems));
    }
  }, [])

  // Listen for logout event to clear cart
  useEffect(() => {
    const handleLogout = () => {
      setItems([]);
      setIsOpen(false);
      setTotal(0);
    };

    window.addEventListener('auth-logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sonnas-cart', JSON.stringify({
      items: items,
    }))
    setTotal(calculateTotal(items));
  }, [items])

  const calculateTotal = (currentItems: CartItem[]) => {
    return currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const addToCart = (item: { id: number; name: string; price: number; image: string }) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
    setIsOpen(true);
  }

  const removeFromCart = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setItems(prevItems => 
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const toggleCart = () => {
    setIsOpen(prev => !prev)
  }

  const clearCart = () => {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ 
      items, 
      isOpen, 
      total, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      toggleCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context;
}
