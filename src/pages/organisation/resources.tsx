import Loader from '@/components/common/loader';
import OrgSidebar from '@/components/common/org_sidebar';
import AccessTree from '@/components/organization/access_tree';
import ResourceCard from '@/components/organization/resource_card';
import { ORG_SENIOR } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import NewResource from '@/sections/organization/resources/new_resource';
import ResourceView from '@/sections/organization/resources/resource_view';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { Resource } from '@/types';
import { initialOrganization } from '@/types/initials';
import checkOrgAccess from '@/utils/funcs/check_org_access';
import Toaster from '@/utils/toaster';
import OrgMembersOnlyAndProtect from '@/utils/wrappers/org_members_only';
import WidthCheck from '@/utils/wrappers/widthCheck';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import { Info, Plus } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState(initialOrganization);

  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [filterStatus, setFilterStatus] = useState(false);

  const [clickedOnResource, setClickedOnResource] = useState(false);
  const [clickedResource, setClickedResource] = useState<Resource | null>(null);
  const [clickedResourceID, setClickedResourceID] = useState(-1);

  const [clickedOnNewResource, setclickedOnNewResource] = useState(false);
  const [clickedOnInfo, setClickedOnInfo] = useState(false);

  const currentOrgID = useSelector(currentOrgIDSelector);
  const getResourceBuckets = () => {
    const URL = `${ORG_URL}/${currentOrgID}/resource`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const resourceData = res.data.resourceBuckets || [];
          console.log(resourceData);
          setOrganization(res.data.organization);
          setResources(resourceData);
          setFilteredResources(resourceData);
          const rid = new URLSearchParams(window.location.search).get('rid');
          if (rid && rid != '') {
            resourceData.forEach((resource: Resource, i: number) => {
              if (rid == resource.id) {
                setClickedResourceID(i);
                setClickedOnResource(true);
              }
            });
          }
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        console.log('Error');
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getResourceBuckets();
  }, []);

  const filterAccessible = (status: boolean) => {
    setFilterStatus(status);
    if (status) {
      const accessibleResources: Resource[] = [];
      resources.forEach(resource => {
        var check = false;
        resource.users.forEach(user => {
          if (user.id == user.id) {
            check = true;
            return;
          }
        });
        if (check) {
          accessibleResources.push(resource);
        }
      });
      setFilteredResources(accessibleResources);
    } else setFilteredResources(resources);
  };

  return (
    <BaseWrapper title="Tasks">
      <OrgSidebar index={8} />
      <MainWrapper>
        {clickedOnNewResource ? (
          <NewResource
            setShow={setclickedOnNewResource}
            organization={organization}
            setResources={setResources}
            setFilteredResources={setFilteredResources}
          />
        ) : (
          <></>
        )}
        {clickedOnInfo ? <AccessTree type="resource" setShow={setClickedOnInfo} /> : <></>}
        <div className="w-full flex flex-col relative">
          <div className="w-full flex justify-between items-center p-base_padding">
            <div className="text-6xl font-semibold dark:text-white font-primary">Resources</div>

            <div className="flex items-center gap-2">
              {checkOrgAccess(ORG_SENIOR) ? (
                <Plus
                  onClick={() => setclickedOnNewResource(true)}
                  size={42}
                  className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
                  weight="regular"
                />
              ) : (
                <></>
              )}
              <Info
                onClick={() => setClickedOnInfo(true)}
                size={42}
                className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
                weight="regular"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-6 px-2 pb-2">
            {loading ? (
              <Loader />
            ) : (
              <>
                {filteredResources.length > 0 ? (
                  <div className="flex justify-evenly px-4">
                    <div className={`w-full flex-wrap max-lg:w-[720px] flex flex-row gap-4`}>
                      {filteredResources.map((resource, i) => {
                        return (
                          <ResourceCard
                            key={resource.id}
                            resource={resource}
                            index={i}
                            clickedResourceID={clickedResourceID}
                            clickedOnResource={clickedOnResource}
                            setClickedOnResource={setClickedOnResource}
                            setClickedResourceID={setClickedResourceID}
                            setClickedResource={setClickedResource}
                          />
                        );
                      })}
                    </div>
                    {clickedOnResource && checkOrgAccess(ORG_SENIOR) ? (
                      <ResourceView setShow={setClickedOnResource} resourceBucket={clickedResource} />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <div className="mx-auto font-medium text-xl mt-8">No Resources Found :)</div>
                )}
              </>
            )}
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default WidthCheck(OrgMembersOnlyAndProtect(Resources));
