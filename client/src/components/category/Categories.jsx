import { memo, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Categories.module.scss";
import Container from "../ui/Container";
import CategoryMenu from "./CategoryMenu";
import { useGetParentCategoriesQuery } from "../../redux/category/categoryApiSlice";

function Categories() {
  const [openMenu, setOpenMenu] = useState(false);

  const { data: parentCategories } = useGetParentCategoriesQuery();

  const handleOpneMenu = () => {
    setOpenMenu(true);
  };

  return (
    <section id={styles.category}>
      <CategoryMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />

      <Container>
        <ul className={styles.category}>
          <li>
            <button onClick={handleOpneMenu} className={styles["menu-btn"]}>
              <span></span> All
            </button>
          </li>
          {parentCategories?.map((category) => (
            <li key={category._id}>
              <Link to={`/products/category/${category.name}`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default memo(Categories);
