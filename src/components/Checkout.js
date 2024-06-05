import { Button } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import CustomTable from "../utils/CustomTable";
import PaymentForm from "../utils/PaymentForm";
import Message from "../utils/Message";
import { Grow, Slide } from "@mui/material";

export default function Checkout() {
    const { state: checkoutDetails } = useLocation();
    const [mode, setMode] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("CHECKOUT DETGIL: ", checkoutDetails)
        if(!(checkoutDetails && checkoutDetails.products && checkoutDetails.products.length > 0)){
            navigate("/products/");
            return;
        }
    }, []);
    if (!checkoutDetails) return <h1>Loading...</h1>;
    switch (mode) {
        case "complete":
            return <Message>
                <Grow in={true} timeout={1000}>
                    <div className="p-3" style={{ textAlign: "center" }}>
                        <h1>Thank You!</h1>
                        <p>Payment should've been approved by now, and your request is on its way to you!</p>
                        <div style={{ textAlign: "center" }}>
                            <div className="flexed-centered">
                                <Button
                                    variant="solid"
                                    size="md"
                                    color="success"
                                    sx={{ alignSelf: 'center', fontWeight: 600 }}
                                    onClick={() => navigate("/products/")}
                                >
                                    Got it!
                                </Button>
                            </div>
                        </div>
                    </div>
                </Grow>
            </Message>
        default:
            return (
                <>
                    <div className="p-5 flexed-centered">
                        <div className="col-sm-12 col-md-6">
                            <Slide direction={"right"} in={true} timeout={500}>
                                <div className="flexed-centered">
                                    <h1>Checkout</h1>
                                </div>
                            </Slide>
                        </div>
                        <Slide in={true} timeout={500} direction="right">
                            <div className="col-md-6 col-sm-12" style={{ textAlign: "center" }}>
                                <h1><strong>Cart Summary</strong></h1>
                                <CustomTable align="center"
                                    lastRowBgColor={"#2b5667"}
                                    lastRowColor={"white"}
                                    headRow={["Item", "Quantity", "Unit Price", "Discount", "Price"]}
                                    data={[
                                        ...checkoutDetails.products.map((product, index) => (
                                            [
                                                product.title,
                                                product.quantity,
                                                product.price,
                                                product.discountPercentage,
                                                `$${(product.price - (product.price * product.discountPercentage / 100)).toFixed(2)}`
                                            ]
                                        )),
                                        [
                                            "Final Total",
                                            "-",
                                            "-",
                                            "-",
                                            `$${checkoutDetails.finalPrice}`
                                        ]
                                    ]}
                                />
                            </div>
                        </Slide>
                    </div>
                    <Grow in={true} timeout={500}>
                        <div className="p-5">
                            <h1 style={{ textAlign: "center" }} className="mb-5">Payment Details</h1>
                            <PaymentForm onComplete={() => setMode("complete")} />
                        </div>
                    </Grow>
                </>
            )
    }
}