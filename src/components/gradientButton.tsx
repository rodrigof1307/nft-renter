import { MouseEventHandler } from 'react'

interface GradientButtonProps {
    buttonText: string,
    nonLoadingText?: string[],
    disabled?: boolean,
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function GradientButton({buttonText, nonLoadingText, disabled, onClick}: GradientButtonProps) {
    
    return(
        <button className={`w-52 h-12 mt-2 button-gradient rounded-md border-2 border-transparent ${disabled ? 'opacity-70' : ''}`}
          onClick={onClick} disabled={disabled}>
          { nonLoadingText && !nonLoadingText.includes(buttonText) ?
            <p className="w-52 h-12 ml-1 mr-0.5 loading text-gradient font-chakra font-semibold" style={{paddingBottom: 4}}>{buttonText}</p>
          :
            <p className="w-52 h-12 text-gradient font-chakra font-semibold" style={{paddingBottom: 4}}>{buttonText}</p>
          }
        </button>     
    )
}