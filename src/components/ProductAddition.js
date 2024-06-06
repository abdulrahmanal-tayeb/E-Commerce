import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';
import Message from '../utils/Message';
import { Button } from '@mui/joy';
import { toast } from 'react-toastify';

const ProductAddition = () => {
    const [mode, setMode] = useState(null);
    const [createdProd, setCreatedProd] = useState(null);
    const navigate = useNavigate();
    const initialValues = {
        title: '',
        description: '',
        category: '',
        price: 0,
        discountPercentage: 0,
        stock: 5,
        tags: '',
        brand: '',
        // Because images should be links to be uploaded to dummyjson, it's skipped for now :)
        images: [''],
        thumbnail: '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        tags: Yup.string().required('At least one tag is required'),
        description: Yup.string().required('Description is required'),
        price: Yup.number().required('Price is required').positive('Price must be a positive number'),
        discountPercentage: Yup.number().required('Discount Percentage is required').min(0, 'Discount Percentage must be at least 0'),
        stock: Yup.number().required('Stock is required').integer('Stock must be an integer').positive('Stock must be a positive number'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...values, tags: values.tags.split(",")})
        })
            .then(res => res.json())
            .then(newProd => {
                setCreatedProd(newProd);
                setMode("complete");
            }).catch(console.log);
    };

    const handleImageUpload = ({ target }) => {
        if (target.files.length > 4) {
            target.value = null;
            return toast.error("4 Files maximum are allowed.");
        }
    }
    switch (mode) {
        case "complete":
            return <Message>
                <div className="p-3" style={{ textAlign: "center" }}>
                    <h1>Product Created!</h1>
                    <p>
                        Your product (<strong>{createdProd.title}</strong>) has been created and submitted to <strong>dummyjson's</strong> databases!
                    </p>
                    <p><strong>Product ID: {createdProd.id}</strong></p>
                    <div style={{ textAlign: "center" }}>
                        <div className='flexed-centered'>
                            <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                sx={{ alignSelf: 'center', fontWeight: 600 }}
                                onClick={() => navigate("/products/")}
                            >
                                Close
                            </Button>
                        </div>

                    </div>
                </div>
            </Message>
        default:
            return (
                <div className="container my-5">
                    <h1 className="mb-4">Product Form</h1>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {[
                                    {
                                        label: "Title",
                                        field: "title"
                                    },
                                    {
                                        label: "Brand",
                                        field: "brand"
                                    },
                                    {
                                        label: "Description",
                                        field: "description",
                                    },
                                    {
                                        label: "Price",
                                        field: "price",
                                        type: "number"
                                    },
                                    {
                                        label: "Discount",
                                        field: "discountPercentage",
                                        type: "number"
                                    },
                                    {
                                        label: "Stock",
                                        field: "stock"
                                    },
                                    {
                                        label: "Tags",
                                        field: "tags",
                                        placeholder: "Seperate tags with comma"
                                    }
                                ].map(({ field, label, type, placeholder }) => (
                                    <div className="form-group mb-3">
                                        <label htmlFor={field} className="form-label">{label}</label>
                                        <Field type={type ?? "text"} className="form-control" id={field} name={field} placeholder={placeholder} />
                                        <ErrorMessage name={field} component="div" className="text-danger" />
                                    </div>
                                ))}

                                <div className="form-group mb-3">
                                    <label htmlFor="thumbnail" className="form-label">Thumbnail</label>
                                    <input className='form-control' type="file" accept="image/*" name="thumbnail" required></input>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="images" className="form-label">Product Images</label>
                                    <input onChange={handleImageUpload} className='form-control' type="file" accept="image/*" name="images" required multiple></input>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    Submit{isSubmitting && "ting..."}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            );
    }
};

export default ProductAddition;