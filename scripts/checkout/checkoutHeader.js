import { numberOfItems } from "../../data/cart.js";

export function renderCheckoutHeader () {
    const itemNumber = numberOfItems();
    document.querySelector('.js-item-numbers').innerHTML = `${itemNumber} items`;
}