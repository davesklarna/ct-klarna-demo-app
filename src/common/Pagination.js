import React from "react";
import Button from "../checkout/Button";

const Pagination = ({ elements, onPrevClick, onNextClick }) => {
  return (
    <>
      {elements && elements.total && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <Button
            text="<"
            onClick={() => onPrevClick()}
            disabled={elements.offset === 0}
          ></Button>
          <div className="mx-2">
            Page {elements.offset / elements.limit + 1} /{" "}
            {Math.ceil(elements.total / elements.limit)}
          </div>
          <Button
            text=">"
            onClick={() => onNextClick()}
            disabled={elements.offset + elements.limit >= elements.total}
          ></Button>
        </div>
      )}
    </>
  );
};

export default Pagination;
