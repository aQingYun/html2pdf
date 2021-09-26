import { useCallback, useState } from "react";
import Modal from "src/component/modal/modal";
import { showLayer } from "src/utils/layer";
import ReactWEditor from "wangeditor-for-react";
import "./index.css";

const Index = () => {
  const [html, setHtml] = useState<string>("");

  const changeHtml = useCallback((htmlstr) => {
    setHtml(htmlstr);
  }, []);

  const downLoadPdf = useCallback(() => {
    showLayer(
      <Modal>
        <div
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        ></div>
      </Modal>
    );
  }, [html]);

  return (
    <div>
      <ReactWEditor
        config={{
          uploadImgShowBase64: true,
          showMenuTooltips: true,
          height: 800,
        }}
        onChange={changeHtml}
      />
      <div className="preview-btn" onClick={downLoadPdf}>
        预览
      </div>
    </div>
  );
};

export default Index;
