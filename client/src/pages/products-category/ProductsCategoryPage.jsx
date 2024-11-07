import styles from "./ProductsCategoryPage.module.scss";

import Container from "../../components/ui/Container";
import ProductList from "../../components/product/ProductList";
import Categories from "../../components/category/Categories";
import Filter from "./components/Filter";

export default function ProductsCategoryPage() {
  return (
    <section>
      <Categories />

      <Container>
        <div className={styles.content}>
          <div className={styles.filter}>
            <Filter />
          </div>

          <div className={styles["products-view"]}>
            <ProductList />
          </div>
        </div>
      </Container>
    </section>
  );
}
