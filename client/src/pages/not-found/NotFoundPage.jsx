import { Link } from "react-router-dom";

import styles from "./NotFoundPage.module.scss";
import Container from "../../components/ui/Container";

const NotFoundPage = () => {
  return (
    <main>
      <Container>
        <div className={styles["not-found-page"]}>
          <p>Page Not Found!</p>
          <Link to="/">back to home page</Link>
        </div>
      </Container>
    </main>
  );
};

export default NotFoundPage;
