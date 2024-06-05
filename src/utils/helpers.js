import { toast } from "react-toastify";

export const addItemToCart = (item, quantity) => {
    if(!quantity) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({...item, quantity});
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Item added to cart!")
}

export const removeItemFromCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = cart.filter(cartItem => cartItem.id !== item.id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Item removed from");
    return item.id;
}