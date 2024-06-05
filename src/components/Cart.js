import { useMemo, useState } from "react"
import ItemCard from "./ItemCard"
import CardsContainer from "./CardsContainer";
import Message from "../utils/Message";
import { Button } from "@mui/joy";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Grow, Slide } from "@mui/material";

export default function Cart() {
    const [products, setProducts] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [removeConfirmation, setRemoveConfirmation] = useState(false);
    const navigate = useNavigate();
    const handleRemove = (removalFunction) => {
        if (!removalFunction) return;
        const removedID = removalFunction();
        setProducts(prev => {
            const productsCopy = prev.slice();
            const newProducts = productsCopy.filter(product => product.id !== removedID)
            return newProducts;
        });
        setRemoveConfirmation(null);
    }

    const handleModify = (id, quantity) => {
        const cart = JSON.parse(localStorage.getItem("cart"));
        if (!cart) return;
        cart.find(product => product.id === id).quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success("Quantity updated successfully");
    }

    const [final, subTotal] = useMemo(() => {
        return [
            products.reduce((acc, current) => {
                return acc + parseFloat(current.price - (current.price * current.discountPercentage / 100));
            }, 0).toFixed(2)
            ,
            products.reduce((acc, current) => {
                return acc + parseFloat(current.price);
            }, 0).toFixed(2)
        ]
    }, [products]);

    return (
        <div className="p-5">
            {removeConfirmation &&
                <Message>
                    <div className="p-3" style={{ textAlign: "center" }}>
                        <h1>{removeConfirmation.title}</h1>
                        <p>{removeConfirmation.text}</p>
                        <div style={{ textAlign: "center" }}>
                            <div className="flexed-centered">
                                <Button
                                    variant="solid"
                                    size="md"
                                    color="primary"
                                    sx={{ alignSelf: 'center', fontWeight: 600 }}
                                    onClick={() => setRemoveConfirmation(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="solid"
                                    size="md"
                                    color="danger"
                                    sx={{ alignSelf: 'center', fontWeight: 600 }}
                                    onClick={() => handleRemove(removeConfirmation.onConfirm)}
                                >
                                    Remove
                                </Button>
                            </div>

                        </div>
                    </div>
                </Message>
            }
            <Slide in={true} timeout={500} direction="down">
                <h1 style={{ textAlign: "center" }}>Shopping Cart ({products.length})</h1>
            </Slide>
            <div className="flexed-centered">
                <Slide in={true} direction="right" timeout={500}>
                    <p>Final Total: <strong>${final}</strong></p>
                </Slide>
                <Slide in={true} direction="left" timeout={500}>
                    <p>Sub Total: <strong>${subTotal}</strong></p>
                </Slide>
            </div>
            <Grow in={products && products.length > 0} timeout={500}>
                <div className="flexed-centered">
                    <Button color="primary" onClick={() => {
                        navigate("/checkout/", {
                            state: {
                                finalPrice: final,
                                products
                            }
                        });
                    }}>Checkout</Button>
                </div>
            </Grow>

            <CardsContainer>
                {products && products.length > 0 ?
                    products.map((product, index) => (
                        <Grow in={true} timeout={500 + index * 100}>
                                <ItemCard
                                    item={product}
                                    key={index}
                                    inCart={true}
                                    setRemoveConfirmation={setRemoveConfirmation}
                                    onModifyComplete={handleModify}
                                />
                        </Grow>
                    ))
                    :
                    <div className="flexed-centered">
                        <h1>No Products added to cart yet.</h1>
                    </div>
                }
            </CardsContainer>
        </div>
    )
}