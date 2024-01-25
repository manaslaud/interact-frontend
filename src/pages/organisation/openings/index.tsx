import BaseWrapper from "@/wrappers/base"
import OrgSidebar from "@/components/common/org_sidebar"
import MainWrapper from "@/wrappers/main"
import getHandler from '@/handlers/get_handler';
import { useSelector } from 'react-redux';
import { currentOrgSelector } from '@/slices/orgSlice';
import {useState,useEffect} from 'react'
import NewOpening from "@/sections/organization/openings/new_opening";
import checkOrgAccess from "@/utils/funcs/check_org_access";
import { Plus } from "@phosphor-icons/react";
export default function OpeningPage(){
    const [loading,setLoading]=useState<boolean>(true);
    const [openingData,setOpeningData]=useState();
    const [openModal,setOpenModal]=useState<boolean>(false);

    const currentOrg = useSelector(currentOrgSelector);
    console.log(currentOrg)
    const getOpenings= async()=>{
        const URL= `/org/${currentOrg.id}/openings/`
        console.log(URL)
        const res= await getHandler(URL)
        console.log(res)
    }
    useEffect(()=>{
        getOpenings()
    },[])
    return(
    <BaseWrapper title="Openings">
        <OrgSidebar index={15}></OrgSidebar>
        <MainWrapper>
        <div className="w-full flex justify-between items-center">
        <div className="w-fit text-6xl font-semibold dark:text-white font-primary">Openings</div>

        <Plus
                  onClick={() => setOpenModal(true)}
                  size={42}
                  className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
                  weight="regular"
                />
        </div>
        <NewOpening/>
        </MainWrapper>
    </BaseWrapper>)

    
}