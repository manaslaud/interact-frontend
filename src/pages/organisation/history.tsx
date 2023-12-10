import Loader from '@/components/common/loader';
import OrgSidebar from '@/components/common/org_sidebar';
import { ORG_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useEffect, useState } from 'react';
import { ProjectHistory } from '@/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SERVER_ERROR } from '@/config/errors';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { useSelector } from 'react-redux';
import Created from '@/components/project_history/created';
import Deleted from '@/components/project_history/deleted';
import Edited from '@/components/project_history/edited';
import Membership from '@/components/project_history/membership';
import OrgMembersOnlyAndProtect from '@/utils/wrappers/org_members_only';
import WidthCheck from '@/utils/wrappers/widthCheck';

const History = () => {
  //TODO Org history components
  const [history, setHistory] = useState<ProjectHistory[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const fetchHistory = async () => {
    const URL = `${ORG_URL}/${currentOrgID}/history?page=${page}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const addedHistory: ProjectHistory[] = [...history, ...(res.data.history || [])];
      if (addedHistory.length === history.length) setHasMore(false);
      setHistory(addedHistory);
      setPage(prev => prev + 1);

      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);
  return (
    <BaseWrapper title="Notifications">
      <OrgSidebar index={7} />
      <MainWrapper>
        <div className="w-full flex flex-col items-center gap-6 max-md:px-2 p-base_padding">
          <div className="w-full text-6xl font-semibold dark:text-white font-primary">History</div>

          {loading ? (
            <Loader />
          ) : (
            <InfiniteScroll
              dataLength={history.length}
              next={fetchHistory}
              hasMore={hasMore}
              loader={<Loader />}
              className="w-full flex flex-col gap-2"
            >
              {history.map((history, index) => {
                switch (history.historyType) {
                  case -1:
                  case 3:
                  case 8:
                  case 9:
                    return <Created history={history} />;
                  case 0:
                  case 1:
                  case 6:
                  case 7:
                  case 10:
                  case 11:
                    return <Membership history={history} />;
                  case 2:
                  case 4:
                    return <Edited history={history} />;
                  case 5:
                    return <Deleted history={history} />;
                  default:
                    return <></>;
                }
              })}
            </InfiniteScroll>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default WidthCheck(OrgMembersOnlyAndProtect(History));
