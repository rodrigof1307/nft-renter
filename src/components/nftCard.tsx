export default function NFTCard({tokenData}: {tokenData: NFTInfo}) {
    
    return(
    <div className="w-80 flex flex-col items-center justify-between" style={{height: '14rem'}}>
        <img className='w-11/12 h-1/2 mx-auto object-contain' src={tokenData.image}/>
        <ImprovedHeading className='text-sky-500 text-xl font-chakra font-bold' improvedText={tokenData.title}/>
        <ImprovedHeading className='text-fuchsia-500 text-sm my-0 font-light' improvedText={tokenData.description}/>
        <div className='flex flex-row justify-around items-center mt-1 w-11/12'>
          {tokenData.attributes?.map((attribute, index) => (
            <ImprovedHeading key={index} className='text-white text-xs bg-slate-500 rounded-md px-3 py-1' improvedText={attribute.value}/>
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