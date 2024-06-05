import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { Slide } from '@mui/material';
import { Divider, Chip } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { removeItemFromCart } from '../utils/helpers';
import { forwardRef, useState } from 'react';
const ItemCard = forwardRef(
    ({ item, inCart, setRemoveConfirmation, onModifyComplete }, ref) => {
        const navigate = useNavigate();
        const [isModifying, setIsModifying] = useState(false);
        const [newQuantity, setNewQuantity] = useState(item.quantity || 0);
        const {
            id,
            title,
            description,
            category,
            price,
            discountPercentage,
            rating,
            thumbnail,
            quantity
        } = item

        return (
            <Card sx={{ width: "clamp(200px, 33%, 400px)", padding: "1em", boxShadow: "0px 0px 10px 0px", overflow: 'hidden' }}>

                <div ref={ref}>
                    <Typography level="title-lg">{title}</Typography>
                    <Typography level="body-sm"><i className='bi bi-star-fill' style={{color: "gold"}}/> {rating} / 5</Typography>
                    {quantity && inCart && <IconButton
                        title='Quantity'
                        variant="plain"
                        color="neutral"
                        size="lg"
                        onClick={() => setIsModifying(true)}
                        sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
                    >
                        <span>{newQuantity}</span>
                    </IconButton>}
                    {isModifying &&
                        <input placeholder="New Quantity" style={{ textAlign: "center" }} className='form-control' onChange={({ target: { value: quantity } }) => setNewQuantity(quantity)} onBlur={({ target: { value: quantity } }) => { setIsModifying(false); onModifyComplete(id, quantity) }} />
                    }
                </div>

                <AspectRatio minHeight="120px" maxHeight="200px">
                    <Slide in={true} timeout={700} direction="up">
                        <img
                            src={thumbnail}
                            loading="lazy"
                            alt=""
                        />
                    </Slide>
                </AspectRatio>
                <div>
                    <Typography level="body-sm">{description.length > 50 ? `${description.slice(0, 50)}...` : description}</Typography>
                    <Divider sx={{ margin: "1em 0em 1em 0em" }} />
                    <Chip
                        color="primary"
                        size="lg"
                        variant="outlined"
                    >{category}</Chip>
                </div>

                <CardContent orientation="horizontal">
                    <div style={{ flexGrow: 1 }}>
                        <Typography level="body-xs">Price:</Typography>
                        <Typography fontSize="lg" fontWeight="lg" sx={{ width: "100%" }}>
                            {discountPercentage ?
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                        <del style={{ fontSize: "small" }}>${price}</del>
                                        <span>${(price - (price * discountPercentage / 100)).toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span><strong>%{discountPercentage} OFF!</strong></span>
                                    </div>
                                </div>
                                :
                                <span>${price}</span>
                            }
                        </Typography>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1em"
                    }}>
                        {inCart && <Button
                            variant="solid"
                            size="md"
                            color="danger"
                            aria-label={title}
                            sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                            onClick={() => setRemoveConfirmation({
                                title: "Confirm Removing Item",
                                text: "Are you sure you want to remove this item from your cart?",
                                onConfirm: () => removeItemFromCart(item)
                            })}
                        >
                            Remove
                        </Button>}
                        <Button
                            variant="solid"
                            size="md"
                            color="primary"
                            aria-label={title}
                            sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                            onClick={() => navigate("/products/details/", { state: item })}
                        >
                            Explore
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }
);
export default ItemCard;