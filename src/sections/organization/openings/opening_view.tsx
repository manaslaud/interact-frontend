import { Cross } from "@phosphor-icons/react"
interface Props{
    setClickedOnOpening:React.Dispatch<React.SetStateAction<boolean>>
    openingId:string,
    openingClicked:any
}
const ViewOpening= (props:Props)=>{
    console.log(props.openingClicked)
return(
<div className="bg-[#000] w-screen h-screen absolute z-[100] top-0 left-0 text-white">
<Cross size={42}
        className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
        weight="regular"
        onClick={()=>{props.setClickedOnOpening(false)}}
        color="white"/>
        <div>
            {props.openingId}
        </div>
       
</div>
)
}
export default ViewOpening;