import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateProductPage.module.scss";
import Container from "../../components/ui/Container";
import Select from "../../components/Select";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useCreateProductMutation } from "../../redux/products/productsApiSlice";
import { useGetCategoriesBrandsQuery, useGetCategoriesQuery } from "../../redux/category/categoryApiSlice";

export default function CreateProductPage() {
  const navigate = useNavigate();

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

  const [createProduct, { isLoading, error: createError }] = useCreateProductMutation();

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

    try {
      const data = await createProduct({
        name: enteredProdctInfo.productName,
        price: enteredProdctInfo.price,
        description: enteredProdctInfo.description,
        image: enteredProdctInfo.image,
        brand: selectedOption?.value,
        categories: selectedOptions?.map((option) => option.value),
        countInStock: enteredProdctInfo.countInStock,
      }).unwrap();

      console.log(data);
      navigate(`/admin/products/${data._id}`);
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <section id={styles["product-create-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Add Product</h2>

          {createError && <ErrorMessage>{createError?.data?.message || createError.error}</ErrorMessage>}

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
              {createError?.data?.extrafield?.errors.hasOwnProperty("name") && <span>{createError?.data?.extrafield?.errors.name}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="price">Price</label>
              <input value={enteredProdctInfo.price} onChange={handleChange} type="number" id="price" name="price" placeholder="1099" />
              {createError?.data?.extrafield?.errors.hasOwnProperty("price") && <span>{createError?.data?.extrafield?.errors.price}</span>}
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
              {uploadError && <span>{uploadError}</span>}
              {createError?.data?.extrafield?.errors.hasOwnProperty("image") && <span>{createError?.data?.extrafield?.errors.image}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="brand">Brand</label>
              <Select value={selectedOption} options={brandsOptions} onChange={(option) => setSelectedOption(option)} />
              {createError?.data?.extrafield?.errors.hasOwnProperty("brand") && <span>{createError?.data?.extrafield?.errors.brand}</span>}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="brand">Categories</label>
              <Select multiple value={selectedOptions} options={categoryOptions} onChange={(option) => setSelectedOptions(option)} />
              {createError?.data?.extrafield?.errors.hasOwnProperty("categories") && <span>{createError?.data?.extrafield?.errors.categories}</span>}
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
              {createError?.data?.extrafield?.errors.hasOwnProperty("description") && (
                <span>{createError?.data?.extrafield?.errors.description}</span>
              )}
            </div>

            <div className={styles.form__group}>
              <label htmlFor="stock">Stock</label>
              <input value={enteredProdctInfo.countInStock} onChange={handleChange} type="number" id="stock" name="countInStock" placeholder="12" />
            </div>

            <button disabled={isLoading}>{isLoading ? "Loading.." : "Add Product"}</button>
          </form>
        </div>
      </Container>
    </section>
  );
}
