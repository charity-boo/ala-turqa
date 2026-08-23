import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseBasePrice } from '../utils/priceFormatter';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('alaTurqaCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('alaTurqaCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id && (i.specialInstructions || '') === (item.specialInstructions || ''));
      if (existingItem) {
        return prevCart.map(i => 
          (i.id === item.id && (i.specialInstructions || '') === (item.specialInstructions || ''))
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prevCart, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id, specialInstructions = '') => {
    setCart(prevCart => prevCart.filter(i => !(i.id === id && (i.specialInstructions || '') === (specialInstructions || ''))));
  };

  const increaseQuantity = (id, specialInstructions = '') => {
    setCart(prevCart => prevCart.map(i => 
      (i.id === id && (i.specialInstructions || '') === (specialInstructions || '')) 
        ? { ...i, quantity: i.quantity + 1 } 
        : i
    ));
  };

  const decreaseQuantity = (id, specialInstructions = '') => {
    setCart(prevCart => prevCart.map(i => 
      (i.id === id && (i.specialInstructions || '') === (specialInstructions || '') && i.quantity > 1) 
        ? { ...i, quantity: i.quantity - 1 } 
        : i
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (parseBasePrice(item.price) * item.quantity), 0);
  };

  const calculateTotal = (deliveryFee = 0) => {
    return calculateSubtotal() + deliveryFee;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      calculateSubtotal,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
