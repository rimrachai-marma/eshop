import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./PriceAt.module.scss";

const PriceRange = () => {
  const [search, setSearch] = useSearchParams();

  const [inputPrice, setInputPrice] = useState({
    min: "",
    max: "",
  });

  // filter by onChange
  const handleChange = (event) => {
    const priceRange = event.target.value;

    if (priceRange === "") {
      search.delete("min_price");
      search.delete("max_price");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("min_price", priceRange.split("-")[0]);
      search.set("max_price", priceRange.split("-")[1]);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setInputPrice((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  //filter by onClick
  const filter = () => {
    if (inputPrice.min === "" || inputPrice.max === "") {
      search.delete("min_price");
      search.delete("max_price");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("min_price", inputPrice.min);
      search.set("max_price", inputPrice.max);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const filterOut = () => {
    search.delete("min_price");
    search.delete("max_price");
    setSearch(search, {
      replace: true,
    });

    setInputPrice({
      min: "",
      max: "",
    });
  };

  return (
    <>
      <label className={styles.label}>price range</label>
      <select className={styles.select} value={`${search.get("min_price")}-${search.get("max_price")}` || ""} onChange={handleChange}>
        <option value="" hidden>
          Select
        </option>
        <option value="01-50">01 to 50</option>
        <option value="51-100">51 to 100</option>
        <option value="101-200">101 to 200</option>
        <option value="201-500">201 to 500</option>
        <option value="501-1000">501 to 1000</option>
      </select>

      <div className={styles.input}>
        <input name="min" type="number" value={inputPrice.min} onChange={changeHandler} />
        <span>to</span>
        <input name="max" type="number" value={inputPrice.max} onChange={changeHandler} />
      </div>

      <div className={styles.btn}>
        <button onClick={filter}>filter</button>
        {(search.get("min_price") || search.get("max_price")) && <button onClick={filterOut}>filter out</button>}
      </div>
    </>
  );
};

export default PriceRange;
