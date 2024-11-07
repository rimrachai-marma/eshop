import styles from "./ProductsPage.module.scss";

import Categories from "../../components/category/Categories";
import ProductList from "../../components/product/ProductList";
import Container from "../../components/ui/Container";
import Filter from "./components/Filter";

function ProductsPage() {
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

export default ProductsPage;
