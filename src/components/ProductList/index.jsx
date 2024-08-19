import { useState } from "react";

import { PageLoader, Header } from "components/commons";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useDebounce from "hooks/useDebounce";
import i18n from "i18next";
import { Search } from "neetoicons";
import { Input, NoData, Pagination } from "neetoui";
import { isEmpty, without } from "ramda";
import withTitle from "utils/withTitle";

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "./constants";
import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [searchKey, setSearchKey] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_INDEX);

  const debouncedSearchKey = useDebounce(searchKey);

  const productsParams = {
    searchTerm: debouncedSearchKey,
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  const { data: { products = [], totalProductsCount } = {}, isLoading } =
    useFetchProducts(productsParams);

  const toggleIsInCart = (slug) =>
    setCartItems((prevCartItems) =>
      prevCartItems.includes(slug)
        ? without([slug], cartItems)
        : [slug, ...cartItems]
    );

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
            onChange={(e) => {
              setSearchKey(e.target.value);
              setCurrentPage(DEFAULT_PAGE_INDEX);
            }}
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
      <div className="mb-5 self-end">
        <Pagination
          count={totalProductsCount}
          navigate={(page) => setCurrentPage(page)}
          pageNo={currentPage || DEFAULT_PAGE_INDEX}
          pageSize={DEFAULT_PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default withTitle(ProductList, i18n.t("title"));
