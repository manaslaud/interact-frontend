import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/common/sidebar';
import { SERVER_ERROR } from '@/config/errors';
import { USER_PROFILE_PIC_URL, USER_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { OrganizationMembership } from '@/types';
import Toaster from '@/utils/toaster';
import NonOrgOnlyAndProtect from '@/utils/wrappers/non_org_only';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Image from 'next/image';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setCurrentOrg, setCurrentOrgMembership } from '@/slices/orgSlice';

const Organizations = () => {
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);

  const router = useRouter();
  const dispatch = useDispatch();

  const fetchMemberships = () => {
    const URL = `${USER_URL}/me/organization/memberships?populate=true`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const organizationMemberships: OrganizationMembership[] = res.data.memberships;
          setMemberships(organizationMemberships);
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleClick = (membership: OrganizationMembership) => {
    dispatch(setCurrentOrg(membership.organization));
    dispatch(setCurrentOrgMembership(membership));

    router.push('/organisation/posts');
  };

  return (
    <BaseWrapper title="Organizations">
      <Sidebar index={10} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-8 px-32 py-10">
          <div className="text-5xl font-semibold dark:text-white font-primary">Memberships</div>

          <div className="w-full flex justify-between flex-wrap">
            {memberships.map(membership => (
              <div
                key={membership.id}
                onClick={() => handleClick(membership)}
                className="w-[49%] hover:scale-105 hover:shadow-xl font-primary bg-white border-[1px] border-primary_btn rounded-md flex max-md:flex-col items-center justify-start gap-6 p-4 transition-ease-300 cursor-pointer"
              >
                <div>
                  <Image
                    crossOrigin="anonymous"
                    width={10000}
                    height={10000}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${membership.organization.user.profilePic}`}
                    className={'rounded-md w-32 h-32'}
                  />
                </div>
                <div className="grow flex max-md:flex-col max-md:text-center max-md:gap-4 items-center justify-between">
                  <div className="w-full flex flex-col gap-2">
                    <div className="text-3xl font-bold text-gradient">{membership.organization.title}</div>
                    <div className="">{membership.title}</div>
                    <div className="font-medium">{membership.role}</div>
                    <div className="text-xs">Joined {moment(membership.createdAt).format('DD MMM YYYY')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default NonOrgOnlyAndProtect(Organizations);
