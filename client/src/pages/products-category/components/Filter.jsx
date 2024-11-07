import styles from "./Filters.module.scss";

// import Brand from "./Brand";
import Sorting from "../../../components/filter/Sorting";
import Rating from "../../../components/filter/Rating";
import InStock from "../../../components/filter/InStock";
import Brand from "../../../components/filter/Brand";
import PriceRange from "../../../components/filter/PriceRange";

function Filter() {
  return (
    <div className={styles.filters}>
      <div className={styles["filter-group"]}>
        <Sorting />
      </div>
      <div className={styles["filter-group"]}>
        <Brand />
      </div>
      <div className={styles["filter-group"]}>
        <Rating />
      </div>
      <div className={styles["filter-group"]}>
        <PriceRange />
      </div>
      <div className={styles["filter-group"]}>
        <InStock />
      </div>
    </div>
  );
}

export default Filter;
