import { useRef } from "react";

import styles from "./CategoryMenu.module.scss";

import { useGetCategorytreeQuery } from "../../redux/category/categoryApiSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../../redux/user/usersApiSlice";
import UserIcon from "../../assets/icons/UserIcon";

function CategoryMenu({ openMenu, setOpenMenu }) {
  const menuRef = useRef(null);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLogedIn = !!userInfo;
  const { data: user, isFetching, refetch } = useGetProfileQuery();

  const { data: categoryTree } = useGetCategorytreeQuery();

  const handleCloseMenu = (event) => {
    const menuDimensions = menuRef.current?.getBoundingClientRect();

    if (
      event.clientX < menuDimensions.left ||
      event.clientX > menuDimensions.right ||
      event.clientY < menuDimensions.top ||
      event.clientY > menuDimensions.bottom
    ) {
      setOpenMenu(false);
    }
  };

  const handleSubMenuOpen = (event) => {
    event.currentTarget.parentNode.nextElementSibling.setAttribute("open", "");
  };

  const handleSubMenuClose = (event) => {
    event.currentTarget.parentNode.parentNode.removeAttribute("open");
  };

  return (
    <div open={openMenu} id={styles.menu}>
      <div onClick={handleCloseMenu} className={styles.backdrop}>
        <div ref={menuRef} className={styles.overly}>
          <div className={styles["menu-header"]}>
            {!isLogedIn && (
              <div className={styles.login}>
                <Link to="/login">
                  <UserIcon className={styles["user-icon"]} /> Sign in
                </Link>
              </div>
            )}

            {isLogedIn && (
              <Link to="/profile">
                <div className={styles.profile}>
                  {!user?.avatar && <UserIcon />}
                  {user?.avatar && <img src={`/api/users/${userInfo._id}/avatar`} alt="avatar" />}
                </div>
                <div className={styles.info}>
                  <h3>{userInfo?.name}</h3>
                  <span>{userInfo?.email}</span>
                </div>
              </Link>
            )}
          </div>
          <div id={styles["main-menu"]}>
            <ul className={styles["menu-list"]}>
              {categoryTree?.map((categoryTreeChild) => (
                <li key={categoryTreeChild._id}>
                  <div className={styles["menu-item-wrapper"]}>
                    <Link to={`/products/category/${categoryTreeChild.name}`}>{categoryTreeChild.name}</Link>

                    {categoryTreeChild?.child.length > 0 && (
                      <button onClick={handleSubMenuOpen}>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                  <ul className={styles["sub-menu-list"]}>
                    <div className={styles["menu-orgin"]}>
                      <button onClick={handleSubMenuClose}>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <title>back</title>
                          <path d="M15.707 17.293l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
                        </svg>
                      </button>
                      <span>{categoryTreeChild.name}</span>
                    </div>

                    {categoryTreeChild?.child?.map((subCategoryTreeChild) => (
                      <SubCategoryMenu key={subCategoryTreeChild._id} subCategoryTreeChild={subCategoryTreeChild} />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.close}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28">
            <title>close</title>
            <path d="M20.281 20.656c0 0.391-0.156 0.781-0.438 1.062l-2.125 2.125c-0.281 0.281-0.672 0.438-1.062 0.438s-0.781-0.156-1.062-0.438l-4.594-4.594-4.594 4.594c-0.281 0.281-0.672 0.438-1.062 0.438s-0.781-0.156-1.062-0.438l-2.125-2.125c-0.281-0.281-0.438-0.672-0.438-1.062s0.156-0.781 0.438-1.062l4.594-4.594-4.594-4.594c-0.281-0.281-0.438-0.672-0.438-1.062s0.156-0.781 0.438-1.062l2.125-2.125c0.281-0.281 0.672-0.438 1.062-0.438s0.781 0.156 1.062 0.438l4.594 4.594 4.594-4.594c0.281-0.281 0.672-0.438 1.062-0.438s0.781 0.156 1.062 0.438l2.125 2.125c0.281 0.281 0.438 0.672 0.438 1.062s-0.156 0.781-0.438 1.062l-4.594 4.594 4.594 4.594c0.281 0.281 0.438 0.672 0.438 1.062z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CategoryMenu;

function SubCategoryMenu({ subCategoryTreeChild }) {
  const handleSubMenuOpen = (event) => {
    event.currentTarget.parentNode.nextElementSibling.setAttribute("open", "");
  };

  const handleSubMenuClose = (event) => {
    event.currentTarget.parentNode.parentNode.removeAttribute("open");
  };
  return (
    <li key={subCategoryTreeChild._id}>
      <div className={styles["menu-item-wrapper"]}>
        <Link to={`/products/category/${subCategoryTreeChild.name}`}>{subCategoryTreeChild.name}</Link>
        {subCategoryTreeChild?.child.length > 0 && (
          <button onClick={handleSubMenuOpen}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
            </svg>
          </button>
        )}
      </div>

      <ul className={styles["sub-menu-list"]}>
        <div className={styles["menu-orgin"]}>
          <button onClick={handleSubMenuClose}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <title>back</title>
              <path d="M15.707 17.293l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path>
            </svg>
          </button>
          <span>{subCategoryTreeChild.name}</span>
        </div>

        {subCategoryTreeChild?.child?.map((subCategoryTreeChild) => (
          <SubCategoryMenu key={subCategoryTreeChild._id} subCategoryTreeChild={subCategoryTreeChild} />
        ))}
      </ul>
    </li>
  );
}
