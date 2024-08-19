import { React } from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import routes from "routes";

import "./App.css";
import Cart from "./components/Cart";
import PageNotFound from "./components/commons/PageNotFound";
import Product from "./components/Product";
import ProductList from "./components/ProductList";

const { show, index } = routes.products;

const App = () => (
  // const [cartItems, setCartItems] = useState([]);

  <Switch>
    <Route exact component={Product} path={show} />
    <Route exact component={ProductList} path={index} />
    <Redirect exact from={routes.root} to={index} />
    <Route exact component={Cart} path={routes.cart} />
    <Route component={PageNotFound} path="*" />
  </Switch>
);
export default App;
