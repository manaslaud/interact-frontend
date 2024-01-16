import React, { useEffect, useState } from 'react';
import { Resource, ResourceFile } from '@/types';
import { Plus } from '@phosphor-icons/react';
import { ORG_SENIOR } from '@/config/constants';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import getHandler from '@/handlers/get_handler';
import { ORG_URL } from '@/config/routes';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import NewResource from '@/components/organization/new_resource_card';
interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  resourceBucket: Resource | null;
}
const ResourceView = ({ setShow, resourceBucket }: Props) => {
  const [showFileModal, setShowFileModal] = useState<boolean>(false);
  const [resourceFiles, setResourceFiles] = useState<ResourceFile[]>([]);
  const currentOrgID = useSelector(currentOrgIDSelector);
  const getResourceBucketFiles = () => {
    const URL = `${ORG_URL}/${currentOrgID}/resource/${resourceBucket?.id}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const resourceFiles = res.data.resourceFiles || [];
          console.log(resourceFiles);
          setResourceFiles(resourceFiles);
        }
      })
      .catch(err => {
        console.log('Error');
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };
  useEffect(() => getResourceBucketFiles(), [resourceFiles]);
  return (
    <>
      <div className="w-[60%] aspect-[500/333] bg-white rounded-xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[100] shadow-lg p-4 ">
        <div className="header flex justify-between">
          <div className="text-3xl font-semibold dark:text-white font-primary">
            {resourceBucket && resourceBucket.title} Resources List
          </div>
          <div className="addResource">
            {checkOrgAccess(ORG_SENIOR) ? (
              <Plus
                size={42}
                className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
                weight="regular"
                onClick={() => setShowFileModal(true)}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <NewResource
          setShowModal={setShowFileModal}
          showModal={showFileModal}
          resourceBucketID={resourceBucket ? resourceBucket.id : null}
          setResourceFiles={setResourceFiles}
          resourceFiles={resourceFiles}
        />
        <div className="file-content w-full">
          <table className="file-table w-full mt-4 rounded-xl overflow-hidden">
            <thead className="bg-primary_text text-white h-10">
              <th>Title</th>
              <th>Description</th>
              <th>Created At</th>
            </thead>
            {resourceFiles.length > 0 &&
              resourceFiles.map((file: ResourceFile, i) => (
                <tr key={i}>
                  <td>{file.title}</td>
                  <td>{file.description}</td>
                  <td>{file.createdAt}</td>
                </tr>
              ))}
          </table>
        </div>
      </div>
      <div className="overlay bg-backdrop w-full h-full fixed top-0 left-0 z-[80]" onClick={() => setShow(false)}></div>
    </>
  );
};

export default ResourceView;
