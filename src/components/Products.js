import { useCallback, useEffect, useState } from "react";
import TypedText from "../utils/TypedText";
import CardsContainer from "./CardsContainer";
import ItemCard from "./ItemCard";
import Input from '@mui/joy/Input';
import { Skeleton } from "@mui/material";
import _debounce from "lodash/debounce"
export default function Products() {
    const [productsData, setProductsData] = useState(null);
    const [fetching, setFetching] = useState(true);
    const fetchProducts = (e) => {
        const value = e && e.target && e.target.value;
        value && setFetching(true);
        fetch(`https://dummyjson.com/products/search/${value ? `?q=${value}` : ""}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(r => r.json())
            .then(data => setProductsData(data))
            .catch(e => console.log("Error: ", e))
            .finally(() => {
                setFetching(false);
            });
    }

    useEffect(() => {
        fetchProducts();
    }, []);
    const debouncedSearch = useCallback(_debounce(fetchProducts, 1000), []);
    const { products } = productsData ?? {};
    return (
        <>
            <div className="flexed-centered" style={{
                width: "100vw", height: "90vh", backgroundColor: "#2b5667",
                flexDirection: "column", color: "white"
            }}>
                <h1>
                    <TypedText text={"Happy Shopping!"}>
                        {(ref) => <strong ref={ref}></strong>}
                    </TypedText>
                </h1>
                <div style={{ marginTop: "2em"}} className="flexed-centered">
                    <div style={{ maxWidth: 500 }}>
                        <Input
                            placeholder="Search for Products..."
                            sx={{
                                '&::before': {
                                    display: 'none',
                                },
                                '&:focus-within': {
                                    outline: '2px solid var(--Input-focusedHighlight)',
                                    outlineOffset: '2px',
                                },
                            }}
                            onChange={debouncedSearch}
                        />
                    </div>
                </div>
            </div>
            <CardsContainer>
                {!fetching && products && products.length > 0 ?
                    products.map((item, index) => <ItemCard key={index} item={item} />)
                    :
                    fetching ?
                        new Array(5).fill(null).map(_ => (
                            <Skeleton variant={"rounded"} sx={{ width: "clamp(200px, 33%, 400px)", height: 350 }} />
                        ))
                        :
                        <div className="flexed-centered">
                            <h1>No Results Found</h1>
                        </div>
                }
            </CardsContainer>
        </>
    );
}
