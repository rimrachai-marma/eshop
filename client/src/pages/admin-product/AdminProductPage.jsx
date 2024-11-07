import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./AdminProductPage.module.scss";
import Container from "../../components/ui/Container";
import Select from "../../components/Select";
import ErrorMessage from "../../components/ui/ErrorMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiSlice from "../../redux/apiSlice";
import { useGetCategoriesBrandsQuery, useGetCategoriesQuery } from "../../redux/category/categoryApiSlice";
import { useGetProductDetailsQuery, useUpdateProductMutation } from "../../redux/products/productsApiSlice";

export default function AdminProductPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { data: product, isFetching, error: fetchError } = useGetProductDetailsQuery(params.id);
  const [updateProduct, { isLoading, error: updateError }] = useUpdateProductMutation();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [enteredProdctInfo, setEnteredProdctInfo] = useState({
    productName: "",
    price: "",
    image: "",
    description: "",
    countInStock: "",
  });
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const { data: brands } = useGetCategoriesBrandsQuery();
  const brandsOptions = brands?.map((brand) => ({ label: brand, value: brand }));

  const { data: categories } = useGetCategoriesQuery();
  const categoryOptions = categories?.map((category) => ({ label: category.name, value: category.name }));

  useEffect(() => {
    setEnteredProdctInfo({
      productName: product?.name ?? "",
      price: product?.price ?? "",
      image: product?.image ?? "",
      description: product?.description ?? "",
      countInStock: product?.countInStock ?? "",
    });
    setSelectedOption(product?.brand ? { label: product?.brand, value: product?.brand } : undefined);
    setSelectedOptions(product?.categories.map((category) => ({ label: category, value: category })) ?? []);
  }, [product]);

  //handler
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEnteredProdctInfo((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  // FILE UPLOAD
  const uploadFileHandler = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setUploadError(null);

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to upload image");
      }

      const imgUrl = await response.json();

      setEnteredProdctInfo((prevValue) => ({
        ...prevValue,
        image: imgUrl,
      }));
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const patchData = {
      name: enteredProdctInfo.productName,
      price: Number(enteredProdctInfo.price),
      description: enteredProdctInfo.description,
      image: enteredProdctInfo.image,
      brand: selectedOption?.value ?? "",
      categories: selectedOptions?.map((option) => option.value),
      countInStock: Number(enteredProdctInfo.countInStock),
    };

    console.log(patchData);

    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getProductDetails", params.id, (draftData) => {
        // console.log(JSON.parse(JSON.stringify(draftData)));

        Object.assign(draftData, patchData);
      })
    );

    try {
      await updateProduct({
        id: params.id,
        data: patchData,
      }).unwrap();
    } catch (err) {
      patchResult.undo();
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <section id={styles["admin-product-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Product Details</h2>

          {fetchError && <ErrorMessage>{fetchError?.data?.message || fetchError.error}</ErrorMessage>}
          {updateError && <ErrorMessage>{updateError?.data?.message || updateError.error}</ErrorMessage>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form__group}>
              <label htmlFor="productName">Name</label>
              <input
                value={enteredProdctInfo.productName}
                onChange={handleChange}
                type="text"
                id="productName"
                name="productName"
                placeholder="iPhone 13 Pro Max, 128GB"
              />
              {updateError?.data?.extrafield?.errors.hasOwnProperty("name") && <span>{updateError?.data?.extrafield?.errors.name}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="price">Price</label>
              <input value={enteredProdctInfo.price} onChange={handleChange} type="number" id="price" name="price" placeholder="1099" />
              {updateError?.data?.extrafield?.errors.hasOwnProperty("price") && <span>{updateError?.data?.extrafield?.errors.price}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="image-upload">Image</label>

              <div className={styles["image-upload-container"]}>
                {!uploading && enteredProdctInfo.image && <p>{enteredProdctInfo.image}</p>}
                {!uploading && !enteredProdctInfo.image && <span>Image url</span>}
                {uploading && <span>Uploading..</span>}
                <label htmlFor="image-upload">
                  <input onChange={uploadFileHandler} type="file" id="image-upload" name="image-upload" placeholder="Image" />
                  Choose File
                </label>
              </div>
              {updateError?.data?.extrafield?.errors.hasOwnProperty("image") && <span>{updateError?.data?.extrafield?.errors.image}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="brand">Brand</label>
              <Select value={selectedOption} options={brandsOptions} onChange={(option) => setSelectedOption(option)} />
              {updateError?.data?.extrafield?.errors.hasOwnProperty("brand") && <span>{updateError?.data?.extrafield?.errors.brand}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="brand">Categories</label>
              <Select multiple value={selectedOptions} options={categoryOptions} onChange={(option) => setSelectedOptions(option)} />
              {updateError?.data?.extrafield?.errors.hasOwnProperty("categories") && <span>{updateError?.data?.extrafield?.errors.categories}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="description">Description</label>
              <textarea
                value={enteredProdctInfo.description}
                onChange={handleChange}
                type="text"
                id="description"
                rows="4"
                name="description"
                placeholder="iPhone 13 Pro. Even more Pro. The iPhone 13 Pro Max on SIMPLE Mobile features the biggest pro system camera upgrade ever..."
              />
              {updateError?.data?.extrafield?.errors.hasOwnProperty("description") && (
                <span>{updateError?.data?.extrafield?.errors.description}</span>
              )}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="stock">Stock</label>
              <input value={enteredProdctInfo.countInStock} onChange={handleChange} type="number" id="stock" name="countInStock" placeholder="12" />
            </div>

            <button disabled={isLoading}>{isLoading ? "Updating.." : "Update"}</button>
          </form>
        </div>
      </Container>
    </section>
  );
}
