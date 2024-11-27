import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import styles from "./Search.module.scss";

import SearchIcon from "../../assets/icons/SearchIcon";
import { useGetCategoriesQuery } from "../../redux/category/categoryApiSlice";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [search, setSearch] = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    if (params.category) {
      setCategory(params.category);
    } else {
      setCategory("");
    }
  }, [params]);

  useEffect(() => {
    if (!params.keyword && !search.get("keyword")) {
      setKeyword("");
    }
  }, [params, search]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (category === "" && keyword === "") {
      navigate("/");

      //
    } else if (
      category === "" &&
      keyword !== "" &&
      !location.pathname.includes("/products/search")
    ) {
      navigate(`products/search/${keyword}`);

      //
    } else if (
      category === "" &&
      keyword !== "" &&
      location.pathname.includes("/products/search")
    ) {
      navigate(`products/search/${keyword + location.search}`);

      //
    } else if (category !== "" && keyword !== "") {
      const searchParam = new URLSearchParams(location.search);
      searchParam.set("keyword", keyword);
      navigate(`products/category/${category}?${searchParam}`);

      //
    } else {
      if (keyword.length === 0) {
        search.delete("keyword");
        setSearch(search, {
          replace: true,
        });
      } else {
        search.set("keyword", keyword);
        setSearch(search, {
          replace: true,
        });
      }
    }
  };

  return (
    <form onSubmit={submitHandler} className={styles.search}>
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className={styles.category}
      >
        <option value="">All</option>
        {categories?.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        className={styles["search-input"]}
        placeholder="Search products"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <button className={styles["search-button"]}>
        <SearchIcon className={styles["search-icon"]} />
      </button>
    </form>
  );
}

export default Search;
