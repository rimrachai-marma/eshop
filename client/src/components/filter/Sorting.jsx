import { useSearchParams } from "react-router-dom";

import styles from "./Sorting.module.scss";

const Sorting = () => {
  const [search, setSearch] = useSearchParams();

  const handleChange = (event) => {
    const sort = event.target.value;

    if (sort === "") {
      search.delete("sort");
      search.delete("order");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("sort", sort.split("-")[0]);
      search.set("order", sort.split("-")[1]);

      setSearch(search, {
        replace: true,
      });
    }
  };

  return (
    <>
      <label className={styles.label}>Sort by</label>

      <select
        className={styles.select}
        value={`${search.get("sort")}-${search.get("order")}` || ""}
        onChange={handleChange}
      >
        <option value="">Default</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="rating-desc">Avg. Customer Review</option>
      </select>
    </>
  );
};

export default Sorting;
