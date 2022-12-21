import {
  ProductionQuantityLimitsRounded,
  Search,
  SentimentDissatisfied,
} from "@mui/icons-material";
//import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [items, setItems] = useState([]);

  //getting the token to check if user is logged in already
  const token = localStorage.getItem("token");

  /* @property {string} productId - Unique ID for the product
   */

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    //loading icon should be dispalyed on making an API Call
    setLoader(true);

    try {
      const url = `${config.endpoint}/products`;
      //as soon as the loading is done set the loader to false to prevent it form showing the icon

      const response = await axios.get(url);
      setLoader(false);
      // console.log(product)
      setProducts(response.data);
      setFilteredProducts(response.data);
      return response.data;
    } catch (error) {
      setLoader(false);
      if (error.response && error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        return null;
      } else {
        return enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const url = `${config.endpoint}/products/search?value=${text}`;
      const response = await axios.get(url);
      setFilteredProducts(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setFilteredProducts([]);
        }
        if (error.response === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          setFilteredProducts(products);
        } else {
          enqueueSnackbar(
            "Could not fetch products. Check that the backend is running, reachable and returns valid JSON",
            { variant: "error" }
          );
        }
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  //fetching the cart details
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const url = `${config.endpoint}/cart`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      return null;
    }
  };

  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };

  const addToCart = async (
    token,
    items,
    productId,
    products,
    qty,
    check = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    if (check.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in Cart.Use the cart sidebar to update quantity or remove item",
        { variant: "warning" }
      );
      return;
    }

    try {
      const url = `${config.endpoint}/cart`;
      const response = await axios.post(
        url,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cartItems = generateCartItemsFrom(response.data, products);
      setItems(cartItems);
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  useEffect(() => {
    performAPICall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //this useEffect is used as we are not sure which promise is resolved first
  // This takes a dependency array as input,
  useEffect(() => {
    // console.log("I am called")
    fetchCart(token)
      .then((cardData) => generateCartItemsFrom(cardData, products))
      .then((cartItems) => setItems(cartItems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // fetchCart(token).then((cardData) => generateCartItemsFrom(cardData,products))
  //take the matching cart items and then set new Cart Items

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />

      <Grid container>
        {/* check if the user is logged in 
         if loggedin then take up 9/12 of the space leave the rest for cart
         else occupy the full space ==> md={token ? 9:12}*/}
        <Grid item className="product-grid" md={token ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {loader ? (
            <Box className="loading">
              <CircularProgress />
              <p>Loading Products</p>
            </Box>
          ) : (
            <Grid container marginY="1rem" paddingY="1rem" spacing={2}>
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      //  {preventDuplicate:true} to distinguish from which addToCart it is called
                      handleAddToCart={async () => {
                        debugger;
                        await addToCart(
                          token,
                          items,
                          product._id,
                          products,
                          1,
                          { preventDuplicate: true }
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}>No Products Found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {/* checking for the token of the logged in user 
        if logged in for small screen occupy the entire space and large screen only use 3/12 of the screen */}
        {token ? (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart
              products={products}
              items={items}
              handleQuantity={addToCart}
            />
          </Grid>
        ) : null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
