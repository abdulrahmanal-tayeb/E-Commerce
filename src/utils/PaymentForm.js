import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { produce } from 'immer';
import { useCallback, useReducer } from 'react';
import { toast } from 'react-toastify';
import _debounce from "lodash/debounce";
export default function PaymentForm({ onComplete }) {

    // Not using formik here, I don't know why honestly :)  but It was used in the other parts of this application!
    const validationFunctions = {
        cardNumber: (value) => String(value).length > 9,
        expiryDate: (value) => value.split("-").length === 3 && new Date(value) >= new Date(),
        cvc: (value) => value,
        cardHolder: (value) => value && value.length > 0
    }
    const [cardData, setCardData] = useReducer((state, { fieldName, value }) => produce(state, (draft) => {
        draft[fieldName] = value;
    }), {});


    const dispatch = useCallback(_debounce((action) => setCardData(action), 300), []);

    const handleSubmission = () => {
        const isValid = ["cardNumber", "expiryDate", "cvc", "cardHolder"].every(field => validationFunctions[field](cardData[field]));
        if (!isValid) {
            toast.error("Please enter valid input in all fields");
            return false;
        }
        onComplete && onComplete();
        localStorage.removeItem("cart");
    }

    return (
        <Card
            variant="outlined"
            sx={{
                maxHeight: 'max-content',
                maxWidth: '100%',
                mx: 'auto',
                overflow: 'auto',
                resize: 'horizontal',
            }}
        >
            <Divider inset="none" />
            <CardContent
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                    gap: 1.5,
                }}
            >
                {[
                    {
                        sx: { gridColumn: '1/-1' },
                        label: "Card Number",
                        fieldName: "cardNumber",
                        inputProps: {
                            error: cardData.cardNumber && !validationFunctions.cardNumber(cardData.cardNumber)
                        }
                    },
                    {
                        label: "Expiry Date",
                        fieldName: "expiryDate",
                        inputProps: {
                            placeholder: "YYYY-MM-DD",
                            error: cardData.expiryDate && !validationFunctions.expiryDate(cardData.expiryDate)
                        }
                    },
                    {
                        label: "CVC/CVV",
                        fieldName: "cvc",
                        inputProps: {
                            error: cardData.cvc && !validationFunctions.cvc(cardData.cvc)
                        }
                    },
                    {
                        sx: { gridColumn: '1/-1' },
                        label: "Card Holder Name",
                        fieldName: "cardHolder",
                        inputProps: {
                            error: cardData.cardHolder && !validationFunctions.cardHolder(cardData.cardNumber)
                        }
                    },
                ].map(field => (
                    <FormControl key={field.label} sx={field.sx}>
                        <FormLabel>{field.label}</FormLabel>
                        <Input
                            onChange={({ target: { value } }) => dispatch({ fieldName: field.fieldName, value })} error={cardData[field.fieldName] && !validationFunctions.cvc(cardData[field.fieldName])}
                            {...field.inputProps}
                        />
                    </FormControl>
                ))}
                <Checkbox label="Save card" sx={{ gridColumn: '1/-1', my: 1 }} />
                <CardActions sx={{ gridColumn: '1/-1' }}>
                    <Button variant="solid" color="primary" onClick={handleSubmission}>
                        Complete Payment
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    );
}