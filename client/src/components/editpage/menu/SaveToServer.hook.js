import axios from "axios";
import html2canvse from "html2canvas";
import { loadingOff, loadingOn } from "../../loading/Loading";
import { SERVER_URL } from "../../../utils/config";

axios.default.withCredentials = true;

function useSaveToServer({
  isLogin,
  deSelectObject,
  setIsSuccessMessage,
  setIsClientError,
  setIsServerError,
  setLoading,
  setIsMessage,
}) {
  async function saveToServer() {
    if (isLogin) {
      await loadingOn(setLoading);
      await deSelectObject();
      await html2canvse(document.querySelector("#canvas-paper"))
        .then((canvas) => {
          const myImage = canvas.toDataURL("image/png");
          if (document.body.clientWidth < 900) {
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
          }
          let blobBin = atob(myImage.split(",")[1]);
          let array = [];
          for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
          }
          let blob = new Blob([new Uint8Array(array)], { type: "image/png" });
          let file = new File([blob], "My card.png", {
            type: "image/png",
          });
          let formData = new FormData();
          formData.append("img", file);

          const accessTokenSession =
            sessionStorage.getItem("accessTokenSession");

          axios({
            method: "POST",
            url: `${SERVER_URL.third}/mycard/post`,
            data: formData,
            headers: {
              authorization: `Bearer ${accessTokenSession}`,
              "content-type": "multipart/form-data boundary=something",
            },
          })
            .then(async () => {
              setIsMessage(true);
              setIsSuccessMessage(true);
              await loadingOff(setLoading);
            })
            .catch((err) => {
              setIsMessage(true);
              setIsServerError(true);
            });
        })
        .catch((err) => {
          setIsMessage(true);
          setIsServerError(true);
        });
    } else {
      setIsMessage(true);
      setIsClientError(true);
    }
  }

  return { operations: { saveToServer } };
}

export default useSaveToServer;
