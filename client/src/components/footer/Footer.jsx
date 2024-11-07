import Container from "../ui/Container";
import styles from "./Footer.module.scss";

function Footer() {
  return (
    <footer id={styles.footer}>
      <Container>
        <p className={styles.footer}>
          Copyright &copy; e-shop, {new Date().getFullYear()}. All rights
          reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
