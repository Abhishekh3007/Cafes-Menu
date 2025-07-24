'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

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
  isFullScreenOpen: boolean
  total: number
  showToast: boolean
  toastMessage: string
  addToCart: (item: { id: number; name: string; price: number; image: string }) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  toggleCart: () => void
  toggleFullScreenCart: () => void
  clearCart: () => void
  closeCart: () => void
  closeFullScreenCart: () => void
  hideToast: () => void
}

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
      setIsFullScreenOpen(false);
      setTotal(0);
      setShowToast(false);
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
    
    // Show toast notification instead of opening cart
    setToastMessage(`${item.name} added to cart!`)
    setShowToast(true)
    
    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 4000)
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

  const toggleFullScreenCart = () => {
    setIsFullScreenOpen(prev => !prev)
    // Close sidebar cart when opening full screen
    if (!isFullScreenOpen) {
      setIsOpen(false)
    }
  }

  const closeCart = () => {
    setIsOpen(false)
  }

  const closeFullScreenCart = () => {
    setIsFullScreenOpen(false)
  }

  const hideToast = () => {
    setShowToast(false)
  }

  const clearCart = () => {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ 
      items, 
      isOpen, 
      isFullScreenOpen,
      total, 
      showToast,
      toastMessage,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      toggleCart,
      toggleFullScreenCart,
      closeCart,
      closeFullScreenCart,
      clearCart,
      hideToast
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
