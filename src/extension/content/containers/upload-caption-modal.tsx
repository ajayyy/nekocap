import Form from "antd/lib/form";
import message from "antd/lib/message";
import Modal from "antd/lib/modal/Modal";
import Select from "antd/lib/select";
import { RcFile } from "antd/lib/upload";
import Dragger from "antd/lib/upload/Dragger";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CaptionFileFormat } from "@/common/types";
import { isLoggedInSelector } from "@/common/feature/login/selectors";
import { MAX_CAPTION_FILE_BYTES } from "@/common/feature/caption-editor/constants";

interface SelectFileModalProps {
  visible: boolean;
  onCancel: () => void;
  onDone: (file: RcFile, contents: string) => void;
}

const validFileTypes = [
  CaptionFileFormat.srt,
  CaptionFileFormat.vtt,
  CaptionFileFormat.sbv,
  CaptionFileFormat.ssa,
  CaptionFileFormat.ass,
];
const supportedFileTypesString = validFileTypes
  .map((fileType) => fileType.toUpperCase())
  .join(", ");

export const SelectFileModal = ({
  visible,
  onCancel,
  onDone,
}: SelectFileModalProps) => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const [fileContent, setFileContent] = useState<string>("");
  const [file, setFile] = useState<RcFile>();

  const beforeUpload = (file: RcFile): boolean | PromiseLike<void> => {
    const extension = file.name
      .substring(file.name.lastIndexOf(".") + 1)
      .toLowerCase();
    const isValidFileType = validFileTypes.includes(extension);
    if (!isValidFileType) {
      message.error(`You can only load ${supportedFileTypesString} files!`);
      return;
    }
    const isSizeValid = file.size < MAX_CAPTION_FILE_BYTES;
    if (!isSizeValid) {
      message.error("Image must smaller than 2MB!");
      return;
    }
    setFile(file);
    return isValidFileType && isSizeValid;
  };

  const dummyRequest = (options: RcCustomRequestOptions) => {
    const { onSuccess } = options;
    if (!file) {
      return;
    }
    onSuccess({}, file);
    const reader = new FileReader();
    reader.onload = (event: Event) => {
      setFileContent((reader.result as string) || "");
    };
    reader.readAsText(file);
  };

  const handleSubmit = (event: React.MouseEvent) => {
    onDone(file, fileContent);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText={"Load"}
      onOk={handleSubmit}
      title={"Select a caption file or drop it into the box below"}
    >
      <Form>
        <div>Supported file types: {supportedFileTypesString}</div>
        <Dragger
          listType="picture-card"
          showUploadList={false}
          beforeUpload={beforeUpload}
          name={"caption"}
          customRequest={dummyRequest}
        >
          {file && file.name}
          {!file && <div>Drop the caption file here!</div>}
        </Dragger>
      </Form>
    </Modal>
  );
};
