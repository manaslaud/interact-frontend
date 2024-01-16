import React, { useState } from 'react';
import { ORG_URL } from '@/config/routes';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import postHandler from '@/handlers/post_handler';
import { ResourceFile } from '@/types';
interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  resourceBucketID: string | null;
  resourceFiles: ResourceFile[];
  setResourceFiles: React.Dispatch<React.SetStateAction<ResourceFile[]>>;
}
const NewResource = ({ showModal, setShowModal, resourceBucketID, resourceFiles, setResourceFiles }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState<string>('No File Selected');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const currentOrgID = useSelector(currentOrgIDSelector);
  const handleAddFile = async () => {
    const URL = `${ORG_URL}/${currentOrgID}/resource/${resourceBucketID}/file`;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    const res = await postHandler(URL, formData, 'multipart/form-data');
    console.log(res);
    setShowModal(false);
    setResourceFiles([res, ...resourceFiles]);
  };

  if (!showModal) {
    return <></>;
  }
  return (
    <>
      <div className="w-[60%] absolute bg-white border-2 border-primary_text shadow-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] p-6 rounded-xl flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Add File</h1>
        <div className="w-full h-fit flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex gap-4 px-4 py-2 dark:bg-dark_primary_comp_hover rounded-lg ">
              <input
                type="text"
                className="grow bg-transparent focus:outline-none text-xl"
                placeholder="File Title"
                maxLength={25}
                value={title}
                onChange={el => setTitle(el.target.value)}
              />
            </div>
            <textarea
              className="w-full min-h-[64px] max-h-36 px-4 py-2 bg-primary_comp dark:bg-dark_primary_comp rounded-lg focus:outline-none"
              placeholder="File Description"
              maxLength={250}
              value={description}
              onChange={el => setDescription(el.target.value)}
            ></textarea>
          </div>
        </div>
        <input
          type="file"
          className="resource-input-field"
          hidden
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setFileName(files[0].name);
              setSelectedFile(files[0]);
              console.log(selectedFile);
            }
          }}
        />
        <div className="upload-container flex gap-4 items-center">
          <div
            className="upload-file-btn  text-primary_text rounded-lg p-2 px-6 border-2 border-primary_text hover:bg-primary_text hover:text-white cursor-pointer w-fit"
            onClick={() => {
              const input_el = document.querySelector('.resource-input-field') as HTMLInputElement | HTMLElement;
              input_el?.click();
            }}
          >
            Select File
          </div>
          <div className="filename">{fileName.length > 25 ? `${fileName.substring(0, 20)}...` : `${fileName}`}</div>
        </div>
        <div className="w-full flex justify-end self-end">
          <div
            className="w-32 p-2 flex-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium text-lg border-2 border-primary_text text-primary_text"
            onClick={handleAddFile}
          >
            Add
          </div>
        </div>
      </div>
      <div className="overlay w-full h-full fixed top-0 left-0 bg-backdrop" onClick={() => setShowModal(false)}></div>
    </>
  );
};

export default NewResource;
