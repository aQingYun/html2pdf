import React, { useCallback, useRef } from "react";
import { layerManage } from "src/utils/layer";
import "./modal.css";
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";

const Modal: React.FC = (props) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const downLoadPdf = useCallback(() => {
    html2Canvas(pdfRef.current as HTMLDivElement, {
      allowTaint: true,
    }).then(function (canvas) {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      let pageHeight = (contentWidth / 592.28) * 841.89;
      let leftHeight = contentHeight;
      let position = 0;
      let imgWidth = 595.28;
      let imgHeight = (592.28 / contentWidth) * contentHeight;
      let pageData = canvas.toDataURL("image/jpeg", 1.0);
      let PDF = new JsPDF(void 0, "pt", "a4");
      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
      PDF.save("下载.pdf");
    });
  }, []);

  return (
    <div
      className="mask"
      onClick={() => {
        layerManage.pop();
      }}
    >
      <div className="content-container">
        <div className="down-btn" onClick={downLoadPdf}>下载PDF</div>
        <div ref={pdfRef}>{props.children}</div>
      </div>
    </div>
  );
};

export default Modal;
