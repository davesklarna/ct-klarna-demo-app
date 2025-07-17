import React, { useEffect, useState } from "react";
import Product from "./Product";
import { authGet } from "../utils/ctApiUtils";
import Pagination from "../common/Pagination";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Products(props) {
  const query = useQuery();
  const page = query.get("page");
  const pageSize = 21;

  const [products, setProducts] = useState({ results: [] });

  const fetchProducts = async (offset) => {
    const res = await authGet(
      `product-projections?limit=${pageSize}&offset=${offset}`
    );
    if (res && res.ok) {
      res
        .json()
        .then((res) => {
          setProducts(res);
        })
        .catch((err) => console.log(err.json()));
    }
  };

  useEffect(() => {
    const offset = page ? pageSize * (page - 1) : 0;
    fetchProducts(offset).then();
  }, [page]);

  const goToPage = async (where) => {
    let offset =
      where === "next"
        ? products.offset + products.limit
        : products.offset - products.limit;
    await fetchProducts(offset).then((data) => {
      if (data) {
        return setProducts(data);
      }
    });
  };

  return (
    <main className="my-8">
      <h3 className="text-gray-700 text-2xl font-medium">Category Name</h3>
      <span className="mt-3 text-sm text-gray-500">
        {products.total} Products
      </span>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {products.results.map((prod) => {
          return <Product product={prod} key={prod.id} />;
        })}
      </div>

      <Pagination
        elements={products}
        onPrevClick={() => goToPage("prev")}
        onNextClick={() => goToPage("next")}
      />
    </main>
  );
}
