import type {Product} from "./types";
import React from "react"
import {useEffect, useState} from "react";

import api from "./api";



const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {

    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, [delay] )
    
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue;
}




const Recommended =  React.memo(function () {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.search().then(setProducts);
  }, []);

  return (
    <main>
      <h1>Productos recomendados</h1>
      <ul>
        {[...products]
          .sort(() => (Math.random() > 0.5 ? 1 : -1))
          .slice(0, 2)
          .map((product) => (
            <li key={product.id}>
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <span>$ {product.price}</span>
            </li>
          ))}
      </ul>
    </main>
  );
})

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [favArr, setFavArr] = useState(() => JSON.parse(localStorage.getItem("fav") )|| [])
  const search = useDebounce(query, 600)




  useEffect(() => {
    api.search(search).then(setProducts);
  }, [search]);

  const addFav =(id) => {
    const isInArr = favArr.includes(id)
    if(isInArr) {
      const newArr  = favArr.filter(item => item !== id)
      console.log(newArr)
      setFavArr(newArr)
    } else {
      setFavArr([...favArr , id])
    }

  }
  useEffect(() => {

    localStorage.setItem("fav", JSON.stringify(favArr))
  }, [favArr])
  
  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {products.map((product) => (
          <li className={`${favArr.includes(product.id) ? "fav" : ""} `} onClick={() => addFav(product.id)} key={product.id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
      <hr />
      <Recommended />
    </main>
  );
}

export default App;
