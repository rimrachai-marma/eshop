import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import styles from "./Pagination.module.scss";
import ChevronIconLeft from "../assets/icons/ChevronIconLeft";
import ChevronIconRight from "../assets/icons/ChevronIconRight";

const Pagination = ({ page, pages }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useSearchParams();

  const handlePageChange = (pageNumber) => {
    if (
      location.pathname !== "/products" &&
      !location.pathname.includes("/products/search") &&
      !location.pathname.includes("/products/category")
    ) {
      navigate(`products?pageNumber=${pageNumber}`);
    } else {
      if (pageNumber === 1) {
        search.delete("pageNumber");
        setSearch(search, {
          replace: true,
        });
      } else {
        search.set("pageNumber", pageNumber);
        setSearch(search, {
          replace: true,
        });
      }
    }
  };

  let pageNumbers = [];

  for (let i = page - 3; i <= page + 3; i++) {
    if (i < 1) continue;
    if (i > pages) break;

    pageNumbers.push(i);
  }

  return (
    pages > 1 && (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronIconLeft />
          <span>previous</span>
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            disabled={page === pageNumber}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages}
        >
          <span>next</span>
          <ChevronIconRight />
        </button>
      </div>
    )
  );
};

export default Pagination;
