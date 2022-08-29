import React, { useRef } from "react";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import Box from "@material-ui/core/Box";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-dnd";
import { quillModules } from "../../../stores/ui/constants";
import Input from "../../components/Input";
import LoadingIndicator from "../../components/LoadingIndicator";
import AddNewItemSection from "../../components/AddNewItemSection";
import Select from "../../components/Select";
export default function GeneralInfo({
  _deleteProductImage,
  product = {},
  setProduct,
  isLoading,
  error,
  categories,
  _uploadFile,
  _uploadImageAndUpdateProduct,
  setImagesArray,
  imagesArray,
  _removeFile,
}) {
  const myFiles = useRef(null);
  const desktopMatches = true;

  if (!product) {
    return null;
  }
  const {
    images = [],
    title,
    description = "",
    categories: selectedCategories = [],
  } = product;
  const deleteProductImage = (_image) => {
    _deleteProductImage(_image.id);
    const selectedImage = images.findIndex((pi) => pi.id === _image.id);
    const newProductImages = [...images];
    newProductImages.splice(selectedImage, 1);
    if (selectedImage > -1) {
      setProduct({ ...product, images: newProductImages });
    }
  };
  const addCategory = (_category) => {
    if (selectedCategories.findIndex((sc) => sc === _category.id) === -1) {
      setProduct({
        ...product,
        categories: [...selectedCategories, _category.id],
      });
    }
  };
  const removeCategory = (_category) => {
    const selectedCategoryIndex = selectedCategories.findIndex(
      (sc) => sc === _category.id
    );
    const _selectedCategories = [...selectedCategories];
    _selectedCategories.splice(selectedCategoryIndex, 1);
    if (selectedCategoryIndex > -1) {
      setProduct({ ...product, categories: _selectedCategories });
    }
  };
  const handleOnDragEnd = (sourceId, sourceIndex, destinationIndex) => {
    const items = Array.from(imagesArray);
    if (destinationIndex === items.length || sourceIndex === items.length)
      return;
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);
    setImagesArray(items);
  };
  return (
    <Paper elevation={2} className="d-flex flex-wrap my-3 py-3">
      <div className="col-12 col-lg-6">
        <div className="flex-1 u-fontLarge">تصاویر محصول</div>
        <div className="py-2 d-flex flex-wrap w-100">
          {isLoading ? (
            <LoadingIndicator isLocal isOpen={isLoading} />
          ) : (
            <GridContextProvider onChange={handleOnDragEnd}>
              <GridDropZone
                id="items"
                boxesPerRow={desktopMatches ? 5 : 3}
                dir="ltr"
                rowHeight={desktopMatches ? 100 : 80}
                style={{ height: desktopMatches ? 400 : 300, width: "100%" }}
              >
                {imagesArray &&
                  imagesArray.map((item, index) => (
                    <GridItem
                      key={item.id}
                      style={{
                        padding: 5,
                        border: index === 0 ? `2px solid #00c896` : "",
                      }}
                    >
                      <div
                        className="position-relative"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <img
                          alt=""
                          className="u-border-radius-4 w-100 h-100"
                          src={item.image_url || item.url}
                          style={{ objectFit: "cover" }}
                        />
                        <div className="liner-gradiant-card u-border-radius-4" />
                        <IconButton
                          className="u-cursor-pointer position-absolute left-0 bottom-0 p-1 z-index-2"
                          onClick={() =>
                            product.id
                              ? deleteProductImage(item)
                              : _removeFile(item.initialIndex)
                          }
                        >
                          <DeleteIcon className="u-text-white" />
                        </IconButton>
                      </div>
                    </GridItem>
                  ))}
                <GridItem key={0} style={{ padding: 5 }}>
                  <AddNewItemSection
                    className="h-100 u-box-shadow-none flex-column-reverse align-items-center justify-content-center p-2 u-border-radius-4"
                    title="عکس"
                    onClick={() => myFiles.current.click()}
                  />
                </GridItem>
              </GridDropZone>
            </GridContextProvider>
          )}
        </div>
      </div>
      <div className="col-12 col-lg-6">
        <div className="flex-1 u-fontLarge">اطلاعات پایه</div>
        <input
          className="d-none"
          ref={myFiles}
          type="file"
          multiple
          onChange={() =>
            _uploadFile(myFiles.current.files, "business_deals_images", () =>
              _uploadImageAndUpdateProduct(product.id, product)
            )
          }
        />
        <Input
          className="my-4"
          label="عنوان محصول"
          value={title}
          onChange={(title) => {
            setProduct({ ...product, title });
          }}
          size="medium"
        />

        <ReactQuill
          className="text-left"
          value={description || ""}
          onChange={(value) => {
            setProduct({ ...product, description: value });
          }}
          modules={quillModules}
          theme="snow"
        />
        <Select
          themeColor="#0050ff"
          inputData={{
            defaultValue: "دسته‌بندی محصول",
          }}
          options={categories.map((_category) => ({
            ..._category,
            text: _category.name,
          }))}
          selectOption={(text) =>
            addCategory(categories.find((cat) => cat.name === text))
          }
          className="medium mt-4"
        />
        <div className="d-flex mt-2">
          {selectedCategories.map((c) => {
            const _category = categories.find((cat) => cat.id === c);
            if (_category)
              return (
                <Chip
                  key={c}
                  style={{ direction: "ltr" }}
                  label={_category.name}
                  onDelete={() => {
                    removeCategory(_category);
                  }}
                  variant="outlined"
                  className="m-1"
                />
              );
          })}
        </div>
        <Box color="error.main">{error}</Box>
      </div>
    </Paper>
  );
}
