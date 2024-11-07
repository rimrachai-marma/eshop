import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import styles from "./Brand.module.scss";
import { useGetCategoryBrandsQuery } from "../../redux/category/categoryApiSlice";

function Brand() {
  const params = useParams();
  const [search, setSearch] = useSearchParams();

  const [brands, setBrands] = useState(search.get("brands")?.split(",") ?? []);

  const { data: categoryBrands } = useGetCategoryBrandsQuery(params.category);

  const filter = () => {
    if (brands.length === 0) {
      search.delete("brands");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("brands", brands.join(","));
      setSearch(search, {
        replace: true,
      });
    }
  };

  const filterOut = () => {
    setBrands([]);
    search.delete("brands");
    setSearch(search, {
      replace: true,
    });
  };

  const onBrandChange = (brand) => (event) => {
    let _brands = brands.slice(); //copy

    if (event.target.checked) {
      _brands.push(brand);
    } else {
      _brands = _brands.filter((_brand) => _brand !== brand);
    }

    setBrands(_brands);
  };

  return (
    <>
      <label className={styles.label}>Brand</label>

      {categoryBrands?.map((brand) => (
        <div key={brand} className={styles.checkbox}>
          <input type="checkbox" checked={brands.includes(brand)} onChange={onBrandChange(brand)} />
          <label>{brand}</label>
        </div>
      ))}

      <div className={styles.btn}>
        <button onClick={filter}>filter</button>

        {search.get("brands") && <button onClick={filterOut}>filter out</button>}
      </div>
    </>
  );
}

export default React.memo(Brand);
