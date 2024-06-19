import {cart, removeFromCart, numberOfItems, editQuantity, editDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import formatCurrency from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary(){
  let cartSummaryHTML = '';

  function generateOrderListHTML () {
    cart.forEach((cartItem)=>{
      const productId = cartItem.productId;
    
      const matchingProduct = getProduct(productId);

      const deliveryOptionId = cartItem.deliveryOptionId;
      const option = getDeliveryOption(deliveryOptionId);
      
      cartSummaryHTML +=
      `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
            Delivery date: ${calculateDeliveryDate(option)}
          </div>
    
          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${matchingProduct.image}">
    
            <div class="cart-item-details">
              <div class="product-name">${matchingProduct.name}</div>
              <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <input class="quantity-input edit-section js-quantity-input-${matchingProduct.id}">
                <span class="update-quantity-link link-primary js-update-quantity-link js-update-quantity-link-${matchingProduct.id}"  data-product-id = "${matchingProduct.id}">
                  Update
                </span>
                <span class="link-primary edit-section js-save-quantity-link js-save-quantity-link-${matchingProduct.id}" data-product-id = "${matchingProduct.id}"></span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}">
                  Delete
                </span>
              </div>
            </div>
    
            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
      `;
    })
  }

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html  = '';
    deliveryOptions.forEach((deliveryOption)=>{
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents 
      === 0 
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;
      
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId; 

      html += 
      `
        <div class="delivery-option js-delivery-option" data-product-id ="${matchingProduct.id}"
        data-delivery-option-id = ${deliveryOption.id}>
          <input type="radio" 
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>
      `;
    });
    return html;
  }


  function displayEditSection(productId) {
    document.querySelector(`.js-save-quantity-link-${productId}`).innerHTML = 'save';
    document.querySelector(`.js-save-quantity-link-${productId}`).classList.remove('edit-section');
    document.querySelector(`.js-quantity-input-${productId}`).classList.remove('edit-section');
    document.querySelector(`.js-quantity-label-${productId}`).classList.add('edit-section');
    document.querySelector(`.js-update-quantity-link-${productId}`).classList.add('edit-section');
  }

  function removeEditSection(productId) {
    document.querySelector(`.js-save-quantity-link-${productId}`).classList.add('edit-section');
    document.querySelector(`.js-quantity-input-${productId}`).classList.add('edit-section');
    document.querySelector(`.js-quantity-label-${productId}`).classList.remove('edit-section');
    document.querySelector(`.js-update-quantity-link-${productId}`).classList.remove('edit-section');
  }

  renderCheckoutHeader ();
  generateOrderListHTML ();
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link)=>{
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderPaymentSummary();
      renderCheckoutHeader ();
      renderOrderSummary();
    })
  })

  document.querySelectorAll('.js-update-quantity-link').forEach((updateLink)=>{
    updateLink.addEventListener('click', ()=>{
      const productId = updateLink.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
      displayEditSection(productId);
    })
  })

  document.querySelectorAll(`.js-save-quantity-link`).forEach((saveLink)=>{
    saveLink.addEventListener('click', ()=>{
      const productId = saveLink.dataset.productId;
      console.log(document.querySelector(`.js-quantity-label-${productId}`).innerHTML);
      const originalQuantity = document.querySelector(`.js-quantity-label-${productId}`).innerHTML;
      let quantity = document.querySelector(`.js-quantity-input-${productId}`).value || originalQuantity;
      if(quantity < 1 || quantity > 1000){
        quantity = originalQuantity;
      }
      editQuantity(productId, quantity);
      removeEditSection(productId);
      renderPaymentSummary();
      renderCheckoutHeader ();
      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = quantity;
    })
  })

  document.querySelectorAll('.js-delivery-option').forEach((option)=>{
    option.addEventListener('click',()=>{
      const {productId, deliveryOptionId} = option.dataset;
      editDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
}

