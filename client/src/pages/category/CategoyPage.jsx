import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./CategoyPage.module.scss";
import Container from "../../components/ui/Container";
import Select, { CMultiselect } from "../../components/Select";
import {
  useGetCategoriesQuery,
  useGetCategoriesBrandsQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "../../redux/category/categoryApiSlice";
import ErrorMessage from "../../components/ui/ErrorMessage";
import apiSlice from "../../redux/apiSlice";

export default function CategoyPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { data: category, error: fetchError } = useGetCategoryQuery(params.id);

  const { data: categories } = useGetCategoriesQuery();
  const categoryOptions = categories?.map((category) => ({ label: category.name, value: category._id }));
  const { data: brands } = useGetCategoriesBrandsQuery();
  const brandsOptions = brands?.map((brand) => ({ label: brand, value: brand }));

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(undefined);

  const [updateCategory, { error: updateError, isLoading }] = useUpdateCategoryMutation();

  useEffect(() => {
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
    setSelectedOptions(category?.brands.map((brand) => ({ label: brand, value: brand })) ?? []);
    setSelectedOption(category?.parentCategory ? { label: category.parentCategory.name, value: category.parentCategory._id } : undefined);
  }, [category]);

  async function submitHandler(e) {
    e.preventDefault();

    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getCategory", params.id, (draftData) => {
        // console.log(JSON.parse(JSON.stringify(draftData)));

        Object.assign(draftData, {
          name,
          description,
          parentCategory: selectedOption?.value
            ? {
                name: selectedOption.label,
                _id: selectedOption.value,
              }
            : undefined,
          brands: selectedOptions.map((option) => option.value),
        });
      })
    );

    try {
      await updateCategory({
        id: category._id,

        data: {
          name,
          description,
          parentCategory: selectedOption?.value ?? "",
          brands: selectedOptions.map((option) => option.value),
        },
      }).unwrap();
    } catch (err) {
      patchResult.undo();
      console.error(err?.data?.message || err.error);
    }
  }

  return (
    <section id={styles["category-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Category</h2>
          {fetchError && <ErrorMessage>{fetchError?.data?.message || fetchError?.error}</ErrorMessage>}
          {updateError && <ErrorMessage>{updateError?.data?.message || updateError?.error}</ErrorMessage>}

          <form onSubmit={submitHandler} className={styles.form}>
            <div className={styles["form-group"]}>
              <label htmlFor="name">Name</label>
              <input onChange={(event) => setName(event.target.value)} value={name} type="text" name="name" id="name" />
              {updateError?.data?.extrafield?.errors.hasOwnProperty("name") && <span>{updateError?.data?.extrafield?.errors.name}</span>}
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
              {isLoading ? "Loading..." : "Update"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
