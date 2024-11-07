import styles from "./SearchPage.module.scss";

import Container from "../../components/ui/Container";
import Filter from "./components/Filter";
import ProductList from "../../components/product/ProductList";
import Categories from "../../components/category/Categories";

function SearchPage() {
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

export default SearchPage;
