import { useSearchParams } from "react-router-dom";
import styles from "./InStock.module.scss";

const InStock = () => {
  const [search, setSearch] = useSearchParams();

  const handleChange = (event) => {
    if (!event.target.checked) {
      search.delete("in_stock");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("in_stock", event.target.checked);
      setSearch(search, {
        replace: true,
      });
    }
  };

  return (
    <>
      <label htmlFor="in_stock" className={styles.label}>
        available in stock
      </label>
      <input
        className={styles.checkbox}
        onChange={handleChange}
        id="in_stock"
        type="checkbox"
        checked={Boolean(search.get("in_stock"))}
      />
    </>
  );
};

export default InStock;
