export default function NFTCard({tokenData}: {tokenData: NFTInfo}) {
    
    return(
    <div className="w-80 flex flex-col items-center justify-between" style={{height: '15rem'}}>
        <img className='w-11/12 h-1/2 mx-auto object-contain' src={tokenData.image}/>
        <ImprovedHeading className='text-white text-lg font-bold' improvedText={tokenData.title}/>
        <ImprovedHeading className='text-white text-sm my-2' improvedText={tokenData.description}/>
        <div className='flex flex-row justify-around items-center mt-1 w-full'>
          {tokenData.attributes?.map((attribute, index) => (
            <ImprovedHeading key={index} className='text-white text-sm bg-slate-500 rounded-md px-3 py-1' improvedText={attribute.value}/>
          ))}
        </div>
    </div>
    )
}

const ImprovedHeading = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {improvedText? : string}) => {
    const {improvedText, children, ...rest} = props;
    
    if(props.improvedText !== undefined){
      return <h6 {...rest}>{props.improvedText}</h6>
    } else {
      return null
    }
  }