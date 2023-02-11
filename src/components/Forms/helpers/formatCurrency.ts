import { DOMElement } from "react";

export function formatNumber(n: string, removeLeadingZeroes: boolean = true) {
  // format number 1000000 to 1,234,567
  let tmp = n.replace(/\D/g, "");
  if (removeLeadingZeroes) {
    return tmp.replace(/^0+(\d)/, "$1").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return tmp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export function formatCurrency(
  input: any,
  blur: boolean = true,
  removeLeadingZeroes: boolean = true
): {
  input_val: string;
  caret_pos: number;
} {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.
  // get input value
  let input_val: string = input.value;

  // don't validate empty input
  if (input_val === "") {
    return {
      input_val: "",
      caret_pos: 0,
    };
  }

  // original length
  let original_len = input_val.length;

  // initial caret position
  let caret_pos: number = input.selectionStart || 0;

  // check for decimal
  if (input_val.indexOf(".") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side =
      formatNumber(left_side, removeLeadingZeroes) === "0"
        ? "0"
        : formatNumber(left_side, removeLeadingZeroes);

    // validate right side
    right_side = formatNumber(right_side, false);

    // On blur make sure 2 numbers after decimal
    if (blur) {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "$" + left_side + "." + right_side;
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;

    // final formatting
    if (blur) {
      input_val += ".00";
    }
  }

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input.setSelectionRange(caret_pos, caret_pos);
  return { input_val, caret_pos };
}
