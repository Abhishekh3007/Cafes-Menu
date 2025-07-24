// Enhanced Menu Items with Add-ons and Customizations
export interface AddOn {
  id: string
  name: string
  price: number
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  addOns: AddOn[]
  sizes?: { size: string; price: number; originalPrice?: number; discount?: number }[]
  preparationTime?: string
  bestseller?: boolean
  spiceLevel?: number // 0-5 chili emojis for spicy items
  sweetnessLevel?: number // 0-5 sugar cube emojis for sweet items
}

export const enhancedMenuItems: MenuItem[] = [
  // Small Bites
  {
    id: 1,
    name: 'Korean Bun',
    description: 'Traditional Korean-style steamed bun',
    price: 160,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.5,
    preparationTime: '15-20 mins',
    spiceLevel: 1, // Mild spice
    addOns: [
      { id: 'extra-sauce', name: 'Extra Korean Sauce', price: 25 },
      { id: 'extra-filling', name: 'Double Filling', price: 50 },
      { id: 'extra-spicy', name: 'Extra Spicy', price: 15 }
    ]
  },
  {
    id: 2,
    name: 'Chilli Korean Bun',
    description: 'Spicy Korean-style steamed bun with chili',
    price: 170,
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.6,
    preparationTime: '15-20 mins',
    bestseller: true,
    spiceLevel: 3, // Medium spice
    addOns: [
      { id: 'extra-chili', name: 'Extra Chili Sauce', price: 30 },
      { id: 'cheese', name: 'Add Cheese', price: 40 },
      { id: 'double-portion', name: 'Double Portion', price: 120 }
    ]
  },
  {
    id: 3,
    name: 'Potato Wedges',
    description: 'Crispy golden potato wedges',
    price: 120,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.3,
    preparationTime: '10-15 mins',
    sizes: [
      { size: '½kg', price: 120 },
      { size: '1kg', price: 200, originalPrice: 240, discount: 40 }
    ],
    addOns: [
      { id: 'dip-mayo', name: 'Mayo Dip', price: 20 },
      { id: 'dip-ketchup', name: 'Tomato Ketchup', price: 15 },
      { id: 'cheese-topping', name: 'Cheese Topping', price: 35 }
    ]
  },
  {
    id: 4,
    name: 'Chilli Garlic Wedges',
    description: 'Spicy potato wedges with chili and garlic',
    price: 150,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.4,
    preparationTime: '12-18 mins',
    spiceLevel: 2, // Mild to medium spice
    addOns: [
      { id: 'extra-garlic', name: 'Extra Garlic', price: 25 },
      { id: 'extra-chili', name: 'Extra Chili', price: 20 },
      { id: 'herbs', name: 'Fresh Herbs', price: 30 }
    ]
  },
  {
    id: 5,
    name: 'Cauliflower Florets',
    description: 'Crispy fried cauliflower florets',
    price: 260,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.2,
    preparationTime: '18-25 mins',
    addOns: [
      { id: 'spicy-coating', name: 'Spicy Coating', price: 35 },
      { id: 'ranch-dip', name: 'Ranch Dip', price: 25 },
      { id: 'extra-portion', name: 'Extra Portion', price: 180 }
    ]
  },

  // Pizza
  {
    id: 6,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 299,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.7,
    preparationTime: '20-25 mins',
    bestseller: true,
    sizes: [
      { size: 'Medium', price: 299 },
      { size: 'Large', price: 450, originalPrice: 500, discount: 50 }
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 60 },
      { id: 'olives', name: 'Black Olives', price: 40 },
      { id: 'mushrooms', name: 'Mushrooms', price: 50 },
      { id: 'pepperoni', name: 'Pepperoni', price: 80 }
    ]
  },
  {
    id: 7,
    name: 'Pepperoni Pizza',
    description: 'Delicious pizza topped with pepperoni slices',
    price: 399,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.8,
    preparationTime: '22-28 mins',
    spiceLevel: 1, // Mild spice from pepperoni
    sizes: [
      { size: 'Medium', price: 399 },
      { size: 'Large', price: 599, originalPrice: 650, discount: 51 }
    ],
    addOns: [
      { id: 'extra-pepperoni', name: 'Extra Pepperoni', price: 100 },
      { id: 'extra-cheese', name: 'Extra Cheese', price: 60 },
      { id: 'jalapenos', name: 'Jalapeños', price: 45 },
      { id: 'bell-peppers', name: 'Bell Peppers', price: 40 }
    ]
  },

  // Burgers
  {
    id: 8,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
    price: 250,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Burgers',
    rating: 4.5,
    preparationTime: '15-20 mins',
    addOns: [
      { id: 'extra-patty', name: 'Extra Patty', price: 120 },
      { id: 'cheese-slice', name: 'Cheese Slice', price: 30 },
      { id: 'bacon', name: 'Crispy Bacon', price: 60 },
      { id: 'fries', name: 'Side of Fries', price: 80 }
    ]
  },
  {
    id: 9,
    name: 'Chicken Burger',
    description: 'Grilled chicken breast with fresh vegetables',
    price: 280,
    image: 'https://images.unsplash.com/photo-1606755456206-1c7331d3d580?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Burgers',
    rating: 4.6,
    preparationTime: '18-22 mins',
    addOns: [
      { id: 'extra-chicken', name: 'Extra Chicken', price: 100 },
      { id: 'spicy-mayo', name: 'Spicy Mayo', price: 25 },
      { id: 'avocado', name: 'Fresh Avocado', price: 50 },
      { id: 'onion-rings', name: 'Onion Rings', price: 70 }
    ]
  },

  // Beverages
  {
    id: 10,
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 120,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Beverages',
    rating: 4.4,
    preparationTime: '5-8 mins',
    sweetnessLevel: 2, // Natural fruit sweetness
    sizes: [
      { size: 'Regular', price: 120 },
      { size: 'Large', price: 180, originalPrice: 200, discount: 20 }
    ],
    addOns: [
      { id: 'extra-pulp', name: 'Extra Pulp', price: 15 },
      { id: 'mint', name: 'Fresh Mint', price: 20 },
      { id: 'ice', name: 'Extra Ice', price: 10 }
    ]
  },

  // Desserts
  {
    id: 11,
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake with chocolate frosting',
    price: 180,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Desserts',
    rating: 4.9,
    preparationTime: '2-3 hours',
    bestseller: true,
    sweetnessLevel: 4, // Very sweet dessert
    sizes: [
      { size: '½kg', price: 675, originalPrice: 1250, discount: 575 },
      { size: '1kg', price: 1250, originalPrice: 1350, discount: 100 }
    ],
    addOns: [
      { id: 'custom-message', name: 'Custom Message', price: 75 },
      { id: 'extra-chocolate', name: 'Extra Chocolate Shavings', price: 100 },
      { id: '1kg-size', name: '1kg Size', price: 575 }
    ]
  },
  {
    id: 12,
    name: 'Premium Chocolate Dessert',
    description: 'Luxury chocolate dessert with premium ingredients',
    price: 675,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Desserts',
    rating: 4.8,
    preparationTime: '2-3 hours',
    bestseller: true,
    sweetnessLevel: 5,
    sizes: [
      { size: '½kg', price: 675, originalPrice: 1250, discount: 575 },
      { size: '1kg', price: 1250, originalPrice: 1350, discount: 100 }
    ],
    addOns: [
      { id: 'custom-message', name: 'Custom Message', price: 75 },
      { id: 'extra-chocolate', name: 'Extra Chocolate Shavings', price: 100 },
      { id: '1kg-size', name: '1kg Size', price: 575 }
    ]
  }
]
