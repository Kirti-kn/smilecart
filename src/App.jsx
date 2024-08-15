import { React } from "react";

import "./App.css";

import { Route, Switch, Redirect } from "react-router-dom";
import routes from "routes";

import ProductList from "./components/ProductList";
import Product from "./components/Product";
import PageNotFound from "./components/commons/PageNotFound";

const { show, index } = routes.products;

const App = () => (
    <>
        <Switch>
            <Route exact component={Product} path={show} />
            <Route exact component={ProductList} path={index} />
            <Redirect exact from={routes.root} to={index} />
            <Route component={PageNotFound} path="*" />
        </Switch>
    </>
);

export default App;