import Categories from "../../components/category/Categories";
import ProductList from "../../components/product/ProductList";
import Container from "../../components/ui/Container";

function HomePage() {
  return (
    <section>
      <Categories />

      <Container>
        <ProductList />
      </Container>
    </section>
  );
}

export default HomePage;
