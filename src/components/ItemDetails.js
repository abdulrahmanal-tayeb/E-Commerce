import { Button, Divider, Slide } from "@mui/material";
import ImageSlider from "../utils/ImageSlider";
import { Chip } from "@mui/joy";
import { Link, useLocation } from "react-router-dom";
import { stubFalse } from "lodash";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import { addItemToCart, removeItemFromCart } from "../utils/helpers";

export default function ItemDetail() {
    const { state: item } = useLocation();
    const [quantity, setQuantity] = useState(0);
    const [addedToCart, setAddedToCart] = useState(stubFalse);
    const isInCart = useMemo(() => localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart")).find(cartItem => cartItem.id === item.id), []);

    const handleAddItem = () => {
        if (quantity > item.stock) {
            return toast.error("No more items available to accomodate your needs.");
        }
        addItemToCart(item, quantity);
        setAddedToCart(true);
    }

    const handleRemoveitem = () => {
        removeItemFromCart(item);
        setAddedToCart(false);
    }

    if (!item) return <h1>Loading...</h1>;
    return (
        <div className="p-5 flexed-centered">
            <Slide direction="right" in={true} timeout={500}>
                <div className="col-sm-12 col-md-6">
                    <div className="flexed-centered" style={{ flexDirection: "column" }}>
                        <ImageSlider images={item.images} />
                        {isInCart || addedToCart ?
                            <div className="flexed-centered" style={{ textAlign: "center", flexDirection: "column" }}>
                                <Button startIcon={<i className="bi bi-cart" />} onClick={handleRemoveitem}> Remove from Cart</Button>
                                <Link to={"/cart/"}>Go to cart <i className="bi bi-box-arrow-up-right" /></Link>
                            </div>
                            :
                            <div style={{ textAlign: "center", ...(item.stock === 0 ? { pointerEvents: "none", filter: "grayscale(1)" } : {}) }}>
                                <input type="number" className="form-control" onChange={({ target: { value } }) => setQuantity(parseInt(value))} placeholder="Quantity" min={1} max={item.stock} />
                                <Button disabled={!quantity} startIcon={<i className="bi bi-cart" />} onClick={handleAddItem}> Add to Cart</Button>
                            </div>
                        }
                    </div>
                </div>
            </Slide>
            <Slide in={true} timeout={500} direction="left">

                <div className="col-md-6 col-sm-12" style={{ textAlign: "center" }}>
                    <h1><strong>{item.title}</strong> <span style={{ fontSize: "small" }}>from <strong>{item.brand}</strong></span></h1>
                    <Chip>{item.category}</Chip>
                    <div className="flexed-centered" style={{ justifyContent: "space-around" }}>
                        <span><i className="bi bi-star-fill" /> Rating: <strong>{item.rating} <span style={{ fontSize: "smaller" }}> / 5</span></strong></span>
                        {item.stock > 0 ?
                            <span><i className="bi bi-check-lg" style={{ color: "green" }} /> {item.stock} available in stock</span>
                            :
                            <span><i className="bi bi-x-lg" style={{ color: "red" }} /> Out of Stock</span>
                        }
                    </div>

                    <Divider />

                    {item.discountPercentage ?
                        <div>
                            <div className="p-3 flexed-centered" style={{ flexDirection: "column", gap: 10 }}>
                                <del style={{ fontSize: "small" }}>${item.price}</del>
                                <h1>${(item.price - (item.price * item.discountPercentage / 100)).toFixed(2)}</h1>
                                <p>%{item.discountPercentage.toFixed(2)} OFF!</p>
                            </div>
                        </div>
                        :
                        <span>${item.price.toFixed(2)}</span>
                    }
                    <p>{item.description}</p>

                    <Divider />

                    <h4>Tags</h4>
                    {item.tags.map((tag, index) => (
                        <Chip variant="outlined" size="lg" sx={{ margin: "1em" }} key={index}>{tag}</Chip>
                    ))}
                </div>
            </Slide>
        </div>
    )
}