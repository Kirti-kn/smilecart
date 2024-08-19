import { useState, useEffect } from "react";

import productsApi from "apis/products";
import { PageLoader, Header } from "components/commons";
import useDebounce from "hooks/useDebounce";
import i18n from "i18next";
import { Search } from "neetoicons";
import { Input, NoData } from "neetoui";
import { isEmpty, without } from "ramda";
import withTitle from "utils/withTitle";

import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const debouncedSearchKey = useDebounce(searchKey);

  const fetchProducts = async () => {
    try {
      const { products } = await productsApi.fetch({
        searchTerm: debouncedSearchKey,
      });
      setProducts(products);
    } catch (error) {
      console.log("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIsInCart = (slug) =>
    setCartItems((prevCartItems) =>
      prevCartItems.includes(slug)
        ? without([slug], cartItems)
        : [slug, ...cartItems]
    );

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchKey]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        cartItemsCount={cartItems.length}
        shouldShowBackButton={false}
        title="Smile cart"
        actionBlock={
          <Input
            placeholder="Search products"
            prefix={<Search />}
            type="search"
            value={searchKey}
            onChange={(event) => setSearchKey(event.target.value)}
          />
        }
      />
      {isEmpty(products) ? (
        <NoData className="h-full w-full" title="No products to show" />
      ) : (
        <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductListItem
              key={product.slug}
              {...product}
              isInCart={cartItems.includes(product.slug)}
              toggleIsInCart={() => toggleIsInCart(product.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default withTitle(ProductList, i18n.t("title"));
