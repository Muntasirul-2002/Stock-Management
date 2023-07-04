"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
export default function Home() {
  //use hooks
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [LoadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);
  //Create a buttonAction
  const buttonAction = async (action, slug, initialQuantity) => {
    // change the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity + 1);
    } else {
      newProducts[index].quantity = parseInt(initialQuantity - 1);
    }
    setProducts(newProducts);

    // change the quantity of the product with given slug in dropdown
    let indexDrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity + 1);
    } else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity - 1);
    }
    setDropdown(newDropdown);
    console.log(action, slug);
    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    console.log(r);
    setLoadingAction(false);
  };
  //Add product fuction, Autometic added to the database and update to the stock management website
  const addProduct = async (e) => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {
        console.log("product added successfully");
        setAlert("✔ Your Product has been added ");
        setProductForm({});
      } else {
        console.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    //fetch all the product again to sync back
    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);

      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    } else {
      setDropdown(false);
    }
  };

  return (
    <>
      <Header />
      {/* ✔ Your Product has been added */}
      <div className="text-green-600 text-center">{alert}</div>

      <div className="container mx-auto my-8">
        <h1 className="text-3xl font-bold mb-6">Search a Product</h1>
        <div className="flex mb-3">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Enter a Product Name"
            className="flex-1 border border-gray-300"
          />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            {/* Loading animation */}
          </div>
        )}
        <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-200 rounded-lg">
          {Array.isArray(dropdown) &&
            dropdown.map((item) => (
              <div
                key={item.slug}
                className="container flex justify-between p-2 my-1 text-black border-b-2"
              >
                <span className="slug">
                  {item.slug} ({item.quantity} available for ₹{item.price})
                </span>
                <div className="mx-5">
                  <button
                    onClick={() =>
                      buttonAction("minus", item.slug, item.quantity)
                    }
                    disabled={LoadingAction}
                    className="subtract inline-block px-3 py-1 hover:cursor-pointer hover:bg-purple-900 hover:text-black hover:font-semibold bg-purple-700 text-white rounded-md shadow-md disabled:bg-purple-300"
                  >
                    -
                  </button>
                  <span className="quantity font-semibold mx-3">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      buttonAction("plus", item.slug, item.quantity)
                    }
                    disabled={LoadingAction}
                    className="add inline-block px-3 py-1 hover:cursor-pointer hover:bg-purple-900 hover:text-black hover:font-semibold bg-purple-700 text-white rounded-md shadow-md disabled:bg-purple-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="container mx-auto my-8">
        <h1 className="text-3xl font-bold mb-6">Add a Product</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">
              Product Slug
            </label>
            <input
              value={productForm.slug || ""}
              onChange={handleChange}
              type="text"
              name="slug"
              id="productName"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity
            </label>
            <input
              value={productForm.quantity || ""}
              onChange={handleChange}
              type="text"
              name="quantity"
              id="quantity"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              value={productForm.price || ""}
              onChange={handleChange}
              type="text"
              name="price"
              id="price"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 hover:bg-purple-600 rounded-xl transition-colors duration-300 ease-in-out"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Display Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug}>
                <td className="border px-4 py-2">{product.slug}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}
