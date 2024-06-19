export let cart = JSON.parse(localStorage.getItem('cart')) || [
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 14,
    deliveryOptionId: '1'
  }
];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    let addAmount = document.querySelector(`.js-selectQuantity${productId}`).value;
    let matchingItem;
    cart.forEach((cartItem)=>{
      if(productId === cartItem.productId){
        matchingItem = cartItem;
      } 
    })
    if (matchingItem) {
      matchingItem.quantity += Number(addAmount);
    } else {
      cart.push({
        productId: productId,
        quantity: Number(addAmount),
        deliveryOptionId: '1'
      });
    }
    saveToStorage();
  }

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem)=>{
    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  })
  cart = newCart;
  saveToStorage();
}

export function numberOfItems() {
  let cartQuantity = 0;
  cart.forEach((cartItem)=>{
    cartQuantity += Number(cartItem.quantity);
  });
  return cartQuantity;
}

export function editQuantity(productId, quantity) {
  cart.forEach((cartItem)=>{
    if(cartItem.productId === productId) {
      cartItem.quantity = quantity;
    }
  })
  saveToStorage();
}

export function editDeliveryOption(productId, option){
  let matchingItem;
  cart.forEach((cartItem)=>{
    if(cartItem.productId === productId){
      matchingItem = cartItem;
    }
  })
  matchingItem.deliveryOptionId = option;
  saveToStorage();
}