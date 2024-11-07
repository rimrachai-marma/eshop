import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateCategoryPage.module.scss";
import Container from "../../components/ui/Container";
import Select, { CMultiselect } from "../../components/Select";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useGetCategoriesQuery, useGetCategoriesBrandsQuery, useCreateCategoryMutation } from "../../redux/category/categoryApiSlice";

export default function CreateCategoryPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(undefined);

  const { data: brands } = useGetCategoriesBrandsQuery();
  const brandsOptions = brands?.map((brand) => ({ label: brand, value: brand }));

  const { data: categories } = useGetCategoriesQuery();
  const categoryOptions = categories?.map((category) => ({ label: category.name, value: category._id }));

  const [createCategory, { isLoading, error: createError }] = useCreateCategoryMutation();

  async function submitHandler(e) {
    e.preventDefault();

    try {
      const data = await createCategory({
        name,
        description,
        parentCategory: selectedOption?.value,
        brands: selectedOptions.map((option) => option.value),
      }).unwrap();

      navigate(`/admin/categories/${data._id}`);
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  }

  return (
    <section id={styles["category-create-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Add Category</h2>

          {createError && <ErrorMessage>{createError?.data?.message || createError?.error}</ErrorMessage>}

          <form className={styles.form}>
            <div className={styles["form-group"]}>
              <label htmlFor="categoryName">Name</label>
              <input onChange={(event) => setName(event.target.value)} value={name} type="text" name="categoryName" id="categoryName" />
              <span>{createError?.data?.extrafield?.errors.name}</span>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="description">
                Description<span>(optional)</span>
              </label>
              <textarea onChange={(event) => setDescription(event.target.value)} value={description} name="description" id="description" rows="4" />
            </div>

            <div className={styles["form-group"]}>
              <label>
                Parent Category<span>(optional)</span>
              </label>
              <Select options={categoryOptions} value={selectedOption} onChange={(option) => setSelectedOption(option)} />
            </div>

            <div className={styles["form-group"]}>
              <label>
                Brands<span>(optional)</span>
              </label>
              <CMultiselect options={brandsOptions} selectedOptions={selectedOptions} onChange={(option) => setSelectedOptions(option)} />
            </div>

            <button disabled={isLoading} onClick={submitHandler}>
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
