import { React } from "react";

import "./App.css";

// import Product from "./components/Product";

import { Route, Switch, NavLink, Redirect } from "react-router-dom";

import ProductList from "./components/ProductList";
import Product from "./components/Product";
import PageNotFound from "./components/commons/PageNotFound";

const App = () => (
    <>
        {/* <div className="flex space-x-2">
            <NavLink exact activeClassName="underline font-bold" to="/">
                Home
            </NavLink>
            <NavLink exact activeClassName="underline font-bold" to="/product">
                Product
            </NavLink>
        </div> */}
        <Switch>
            <Route exact component={ProductList} path="/products" />
            <Redirect exact from="/" to="/products" />
            <Route exact component={Product} path="/products/:slug" />
            <Route component={PageNotFound} path="*" />
        </Switch>
    </>
);

export default App;