import { useEffect, useState } from "react";

import { Typography } from "antd";
import productsApi from "apis/products";
import { Header, PageLoader, PageNotFound } from "components/commons";
import AddToCart from "components/commons/AddToCart";
import useSelectedQuantity from "hooks/useSelectedQuantity";
import { Button } from "neetoui";
import { append, isNotNil } from "ramda";
import { useParams } from "react-router-dom";
import routes from "routes";
import withTitle from "utils/withTitle";

import Carousel from "./Carousel";

let productName = "";

const Product = () => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { slug } = useParams();
  productName = slug;
  // console.log(productName);
  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);

  const fetchProduct = async () => {
    try {
      const response = await productsApi.show(slug);
      setProduct(response);
    } catch (error) {
      console.log(error);
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
    return <PageLoader />;
  }

  const {
    name,
    description,
    mrp,
    offerPrice,
    imageUrls,
    imageUrl,
    availableQuantity,
  } = product;
  const totalDiscounts = mrp - offerPrice;
  const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed(1);

  return (
    <div className="px-6 pb-6">
      <Header title={name} />
      <div className="mt-6 flex gap-4">
        <div className="w-2/5">
          {isNotNil(imageUrls) ? (
            <Carousel imageUrls={append(imageUrl, imageUrls)} title={name} />
          ) : (
            <img alt={name} className="w-48" src={imageUrl} />
          )}
        </div>
        <div className="w-3/5 space-y-4">
          <Typography>{description}</Typography>
          <Typography>MRP: {mrp}</Typography>
          <Typography className="font-semibold">
            Offer price: {offerPrice}
          </Typography>
          <Typography className="font-semibold text-green-600">
            {discountPercentage}% off
          </Typography>
          <div className="flex space-x-10">
            <AddToCart {...{ availableQuantity, slug }} />
            <Button
              className="bg-neutral-800 hover:bg-neutral-950"
              label="Buy now"
              size="large"
              to={routes.checkout}
              onClick={() => setSelectedQuantity(selectedQuantity || 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

console.log(productName);
export default withTitle(Product, productName);
