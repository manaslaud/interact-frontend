interface Props{
    isActive:boolean,
    description:string,
    tags:string[],
    title:string,
    openingId:string,
    setClickedOnOpening:React.Dispatch<React.SetStateAction<boolean>>,
    clickedOnOpening:boolean,
    setClickedOnOpeningId:React.Dispatch<React.SetStateAction<string>>,
    opening:any,
    setOpeningClicked:React.Dispatch<React.SetStateAction<any>>
}
const OpeningCard= (
    props:Props
)=>{
    return(
    <div className="flex text-wrap w-[30%] rounded-[1rem] bg-[#000000] text-white text-2xl h-3/6 relative" onClick={()=>{
        props.setClickedOnOpening(true)
        props.setOpeningClicked(props.opening)
        props.setClickedOnOpeningId(props.openingId)
    }}>
        <div>Active:{props.isActive.toString()}</div>
        <div>Title:{props.title}</div>
        <div>Description{props.description}</div>
        <div className="flex flex-row w-full">
        Tags
        {props.tags?(props.tags.map((tag, index) => (
            
        <div key={index}>{tag}</div>
      ))):''}
        </div>
        
    </div>
    )
    }
    export default OpeningCard;