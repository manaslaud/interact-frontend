import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { Organization, PRIORITY, Task, User, Resource } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { SERVER_ERROR } from '@/config/errors';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import { ORG_MANAGER } from '@/config/constants';
import AccessTree from '@/components/organization/access_tree';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  organization: Organization;
  setShowResources?: React.Dispatch<React.SetStateAction<boolean>>;
  setResources?: React.Dispatch<React.SetStateAction<Resource[]>>;
  setFilteredResources?: React.Dispatch<React.SetStateAction<Resource[]>>;
}

const NewResource = ({ setShow, organization, setShowResources, setResources, setFilteredResources }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mutex, setMutex] = useState(false);
  const [tab, setTab] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleSubmit = async () => {
    if (title.trim().length == 0) {
      Toaster.error('Title cannot be empty');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding a new resource bucket');

    const URL = `${ORG_URL}/${currentOrgID}/resource`;
    const formData = {
      title,
      description,
      viewAccess: ORG_MANAGER,
      editAccess: ORG_MANAGER,
    };

    const res = await postHandler(URL, formData);
    if (res.statusCode === 201) {
      const resource_bucket = res.data.resourceBucket;
      if (setResources) setResources(prev => [...prev, resource_bucket]);
      if (setFilteredResources) setFilteredResources(prev => [...prev, resource_bucket]);
      console.log(resource_bucket);
      setShow(false);
      if (setShowResources) setShowResources(true);
      Toaster.stopLoad(toaster, 'New Resource Bucket Added!', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
      setMutex(false);
    }
  };

  return (
    <>
      <div className="fixed top-1/2 -translate-y-1/2 w-[640px] max-md:w-5/6 backdrop-blur-2xl bg-white dark:bg-[#ffe1fc22] flex flex-col gap-4 rounded-lg p-10 max-md:p-5 dark:text-white font-primary border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 translate-x-1/2 animate-fade_third z-50">
        {tab === 0 ? (
          <>
            <div className="text-3xl max-md:text-xl font-semibold">Resource Bucket Info</div>
            <div className="w-full h-fit flex flex-col gap-4">
              <div className="w-full flex flex-col gap-4">
                <div className="w-full flex gap-4 px-4 py-2 dark:bg-dark_primary_comp_hover rounded-lg ">
                  <input
                    type="text"
                    className="grow bg-transparent focus:outline-none text-xl"
                    placeholder="Resource Bucket Title"
                    maxLength={25}
                    value={title}
                    onChange={el => setTitle(el.target.value)}
                  />
                </div>
                <textarea
                  className="w-full min-h-[64px] max-h-36 px-4 py-2 bg-primary_comp dark:bg-dark_primary_comp rounded-lg focus:outline-none"
                  placeholder="Resource Description"
                  maxLength={250}
                  value={description}
                  onChange={el => setDescription(el.target.value)}
                ></textarea>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-3xl max-md:text-xl font-semibold">Manage Access</div>
          </>
        )}
        <div className={`w-full flex justify-end self-end}`}>
          <div
            onClick={() => {
              if (tab === 0) {
                setTab(1);
              } else if (tab === 1) {
                handleSubmit();
              }
            }}
            className="w-32 p-2 flex-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium text-lg border-2 border-primary_text text-primary_text"
          >
            {tab === 0 ? 'Next' : 'Create'}
          </div>
        </div>
      </div>

      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default NewResource;
