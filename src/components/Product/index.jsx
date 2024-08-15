import { useEffect, useState } from "react";
import { Typography } from "antd";
import Carousel from "./Carousel";
import productsApi from "apis/products";
import { useParams } from "react-router-dom";
import { append, isNotNil } from "ramda";
import { Header, PageLoader, PageNotFound } from "components/commons";

const Product = () => {

    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const { slug } = useParams();

    const fetchProduct = async () => {
        try {
            const response = await productsApi.show(slug);
            setProduct(response);
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    if (isError) return <PageNotFound />;

    if (isLoading) {
        return(<PageLoader />);
    }

    const {
        name,
        description,
        mrp,
        offerPrice,
        imageUrls,
        imageUrl,
    } = product;
    const totalDiscounts = mrp - offerPrice;
    const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed(1);


    return (
        <div className="px-6 pb-6">
            <Header title={name} />
            <div className="flex gap-4 mt-6">
                <div className="w-2/5">
                    {isNotNil(imageUrls) ? (
                        <Carousel imageUrls={append(imageUrl, imageUrls)} title={name} />
                    ) : (
                        <img alt={name} className="w-48" src={imageUrl} />
                    )}
                </div>
                <div className="w-3/5 space-y-4">
                    <Typography>
                        {description}
                    </Typography>
                    <Typography>MRP: {mrp}</Typography>
                    <Typography className="font-semibold">Offer price: {offerPrice}</Typography>
                    <Typography className="font-semibold text-green-600">{discountPercentage}% off</Typography>
                </div>
            </div>
        </div>
    );
};

export default Product;