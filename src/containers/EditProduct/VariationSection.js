import React from "react";
import Collapse from "@material-ui/core/Collapse";
import useTheme from "@material-ui/core/styles/useTheme";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ChipInput from "material-ui-chip-input";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Button from "@material-ui/core/Button";
import Input from "../../components/Input";
import { uniqueid, convertVariantToTable } from "../../../utils/helper";
export default function VariationSection({
  product,
  variations,
  setVariations,
  history,
}) {
  if (!variations || !product) {
    return null;
  }
  const theme = useTheme();
  const handleAddIconAction = () => {
    const _newVariations = {
      ...variations,
      variations_data: [
        ...variations.variations_data,
        {
          id: uniqueid(),
          name: "",
          values: [],
        },
      ],
    };
    _newVariations.variations_table = convertVariantToTable(
      _newVariations.variations_data,
      false,
      variations.variations_table,
      product
    );

    setVariations(_newVariations);
  };

  const handleDeleteIconAction = (index) => {
    const newVariations = { ...variations };
    newVariations.variations_data.splice(index, 1);
    newVariations.variations_table = convertVariantToTable(
      newVariations.variations_data,
      false,
      variations.variations_table,
      product
    );
    setVariations(newVariations);
  };
  const variationNameHandler = (title, index) => {
    const newVariations = { ...variations };
    newVariations.variations_data[index].name = title;
    newVariations.variations_table = convertVariantToTable(
      variations.variations_data,
      true,
      variations.variations_table,
      product
    );
    setVariations(newVariations);
  };

  const chipInputHandler = (chips, index) => {
    try {
      const newVariations = { ...variations };
      newVariations.variations_data[index].values = chips.map((chip) => {
        const chipFound = newVariations.variations_data[index].values.find(
          (item) => item.value === chip
        );
        return {
          id: chipFound ? chipFound.id : uniqueid(),
          value: chip,
        };
      });
      newVariations.variations_table = convertVariantToTable(
        newVariations.variations_data,
        true,
        newVariations.variations_table,
        product
      );
      setVariations(newVariations);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Paper className="my-3 px-3 pt-2 pb-3">
      <div className="d-flex align-items-center">
        <Box className="u-fontLarge u-text-night">
          افزودن گوناگونی‌های دیگر به محصول
        </Box>
      </div>
      <Box className="u-fontMedium px-2 u-text-darkest-grey">
        گوناگونی می‌تواند شامل رنگ، سایز و جنس و... باشد.
      </Box>
      <Collapse in={true}>
        {!variations.variations_data ||
          (variations.variations_data &&
            variations.variations_data.length === 0 && (
              <div onClick={handleAddIconAction} className="mt-1">
                <IconButton>
                  <AddCircleOutlineIcon
                    color="primary"
                    style={{ cursor: "pointer" }}
                  />
                </IconButton>
                <span className="u-cursor-pointer u-text-primary-blue">
                  افزودن گوناگونی جدید
                </span>
              </div>
            ))}
        {variations.variations_data &&
          variations.variations_data.map((variation, index) => (
            <div className="mt-3 d-flex align-items-start" key={variation.id}>
              <div style={{ flex: 3 }} className="mx-1 mt-1">
                <Input
                  placeholder="مثلا رنگ"
                  className="mt-2 pr-1 mt-lg-0"
                  size="medium"
                  value={variation.name || ""}
                  onChange={(value) => variationNameHandler(value, index)}
                />
                <div className="pr-1 u-font-semi-small u-text-darkest-grey">
                  مثال: رنگ
                </div>
              </div>
              <div style={{ flex: 5 }} className="mx-1 mt-1">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  .MuiChip-deleteIcon{
                    margin: 0px;
                  }
                  .MuiChip-root  {
                    margin: 12px 8px 12px 0px ;
                  }
                  // .MuiInputBase-input {
                  //   padding-bottom : 4px !important;
                  // }
                  .WAMuiChipInput-label.WAMuiChipInput-outlined.WAMuiChipInput-label:not(.WAMuiChipInput-labelShrink){
                    top: -7px;
                  }
                  .MuiInputLabel-outlined {
                    transform : translate(-12px, 12px) scale(1);
                  }
                `,
                  }}
                />
                <ChipInput
                  onChange={(chips) => chipInputHandler(chips, index)}
                  label="موارد گوناگونی"
                  variant="outlined"
                  multiline
                  fullWidth
                  fullWidthInput
                  className="mt-2 mt-lg-0 "
                  defaultValue={variation.values.map((item) => item.value)}
                  InputProps={{ style: { height: "unset", padding: 0 } }}
                  InputLabelProps={{ style: { padding: 0 } }}
                />
                <div className="u-font-semi-small mt-1 u-text-darkest-grey">
                  مثال: مشکی، سفید ،‌آبی
                </div>
              </div>
              <IconButton onClick={() => handleDeleteIconAction(index)}>
                <DeleteRoundedIcon
                  color="primary"
                  style={{ cursor: "pointer" }}
                />
              </IconButton>
              {variations.variations_data.length - 1 === index ? (
                <IconButton onClick={handleAddIconAction}>
                  <AddCircleOutlineIcon
                    color="primary"
                    style={{ cursor: "pointer" }}
                  />
                </IconButton>
              ) : null}
            </div>
          ))}
        {variations && Object.keys(variations.variations_table).length > 0 && (
          <TableContainer className="mt-5">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right" className="text-nowrap"></TableCell>

                  <TableCell align="right" className="text-nowrap">
                    نام گوناگونی
                  </TableCell>
                  <TableCell align="right" className="text-nowrap">
                    قیمت واحد (تومان)
                  </TableCell>
                  <TableCell align="right" className="text-nowrap">
                    قیمت نهایی
                  </TableCell>
                  <TableCell align="right" className="text-nowrap">
                    موجودی
                  </TableCell>
                  <TableCell align="right" className="text-nowrap"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variations &&
                  Object.keys(variations.variations_table).map((key) => {
                    const item = variations.variations_table[key];
                    return (
                      <TableRow key={key}>
                        <TableCell
                          align="right"
                          component="th"
                          scope="row"
                          style={{ minWidth: "10%" }}
                        >
                          <div className="mt-2 mt-lg-0">
                            <img
                              src={item.image_url || product.main_image_url}
                              width={40}
                              height={40}
                            />
                          </div>
                        </TableCell>
                        <TableCell
                          align="right"
                          component="th"
                          scope="row"
                          style={{ minWidth: "20%" }}
                        >
                          <div className="mt-2 mt-lg-0">{item.name}</div>
                        </TableCell>
                        <TableCell align="right" className="text-nowrap">
                          <div className="mt-2 mt-lg-0" size="medium">
                            {item.initial_price}
                          </div>
                        </TableCell>
                        <TableCell align="right" className="text-nowrap">
                          <div className="mt-2 mt-lg-0" size="medium">
                            {item.discounted_price}
                          </div>
                        </TableCell>
                        <TableCell align="right" className="text-nowrap">
                          <div className="mt-2 mt-lg-0" size="medium">
                            {item.inventory_count}
                          </div>
                        </TableCell>

                        <TableCell align="right" className="text-nowrap">
                          <Button
                            color="primary"
                            onClick={() => {

                              history.push(
                                `/products/${product.id}/variant/${item.id}`
                              );
                            }}
                            disabled={item.new}
                            style={{ direction: "ltr" }}
                            endIcon={
                              <div
                                className="d-flex align-items-center justify-content-center u-border-radius-50-percent"
                                style={{
                                  border: `2px solid ${
                                    item.new ? "#eeeeee" : "#0050ff"
                                  }`,
                                  width: 24,
                                  height: 24,
                                }}
                              >
                                <EditRoundedIcon style={{ fontSize: 14 }} />
                              </div>
                            }
                          >
                            ویرایش
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Collapse>
    </Paper>
  );
}
