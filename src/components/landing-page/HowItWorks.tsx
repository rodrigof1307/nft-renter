import { useState } from 'react'
import Carousel, { ControlProps } from 'nuka-carousel'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const HowItWorks = () => {
  const [title, setTitle] = useState('Collateralized')

  const collateralized = {
    description: 'On collateralized loans, the renter is able to own the NFT by paying the rental price and putting up collateral to safeguard the lenter if he doesn’t return the NFT.',
    steps: [
      'The lenter transfers his NFT to an escrow smart contract where the collateral value and the rental rate are also defined.',
      'The renter transfers the collateral value and the rental value associated with the rental period to the escrow smart contract. The renter will then receive ownership of the NFT',
      'Once the rental period ends, the lenter is able to claim the rental value while the renter must return te NFT to the escrow smart contract. If the NFT hasn’t been returned, the lenter is able to claim the collateral value as well.',
    ],
    advantages: [
      'By actually owning the NFT, the renter can access all of its utility regardless of support for rental protocols',
    ],
    disadvantages: [
      'There is a high financial entry barrier for the renter',
      'The lenter risks losing the NFT, which can be specially damaging if the NFT price surges ahead of the collateral',
    ],
  }

  const nonCollateralized = {
    description: 'On non-collateralized loans, the renter pays the rental price and receives a wrapped token with the same properties as the NFT. The NFT remains on an escrow smart contract which can be accessed by the owner.',
    steps: [
      'The lenter transfers his NFT to an escrow smart contract where the rental rate is also defined.',
      'The renter transfer the rental value associated with the rental period to the escrow smart contract. The renter will then receive a wrapped token representing the NFT',
      'Once the rental period ends, the lenter is able to claim the rental value as well as its NFT while the renter becomes unable to use the wrapped token. If the lenter wishes he can leave the NFT on the smart contract for others to rent it using the same dynamic.',
    ],
    advantages: [
      'The lenter remains in control of the NFT',
      'The renter becomes automatically unable to use the NFT once the rental period ends',
    ],
    disadvantages: [
      'The ecosystem will have to adopt the standard in order to become usable',
    ],
  }

  const toggleTitle = (titleState: string) => (
    titleState === 'Collateralized' ? 'Non-Collateralized' : 'Collateralized'
  )

  const topRightControls = (props: ControlProps) => (
    <div className="flex w-[7vw] flex-row justify-between items-center -mt-[4.25vw] mr-[4vw]">
      <NavigationButton direction="left"
        onClick={() => {
          setTitle(toggleTitle)
          props.previousSlide()
        }
        }/>
      <NavigationButton direction="right"
        onClick={() => {
          setTitle(toggleTitle)
          props.nextSlide()
        }
        }/>
    </div>
  )

  return (
    <div>
      <h2 className="text-white font-highlight font-extrabold text-5xl mt-[3vw] ml-[4vw]">
        How It Works
      </h2>
      <h4 className="text-white font-highlight text-4xl mt-[1.5vw] mb-[1vw] ml-[4vw]">
        {title ?? ''}
      </h4>
      <Carousel wrapAround
        renderCenterLeftControls={null}
        renderCenterRightControls={null}
        renderBottomCenterControls={null}
        renderTopRightControls={topRightControls}>
        <Method {...collateralized}/>
        <Method {...nonCollateralized}/>
      </Carousel>
    </div>
  )
}

type MethodProps = {
    description: string
    steps: string[]
    advantages: string[]
    disadvantages: string[]
}

const Method = ({ description, steps, advantages, disadvantages }: MethodProps) => (
  <div className="w-[92vw] mx-auto flex flex-col justify-start items-left bg-black bg-opacity-25 border-darkPurple border-2 rounded-[1.5vw] p-[2.25vw]">
    <p className="text-white font-medium text-lg mb-[1.5vw]">
      {description}
    </p>
    {steps.map((step, index) => (
      <div key={step}>
        <h5 className="font-highlight text-xl mb-[0.25vw] text-white">{`Step ${index + 1}`}</h5>
        <p className="text-white font-medium text-lg mb-[1.5vw]">
          {step}
        </p>
      </div>
    ))}
    <div className="flex flex-row justify-around items-start">
      <div className="w-[37.5vw]">
        <h5 className="font-highlight text-xl mb-[0.5vw] text-white text-center">Advantages</h5>
        {advantages.map((advantage) => (
          <p className="text-white font-medium text-lg mb-[1vw]" key={advantage}>
            {advantage}
          </p>
        ))}
      </div>
      <div className="w-[37.5vw]">
        <h5 className="font-highlight text-xl mb-[0.5vw] text-white text-center">Disadvantages</h5>
        {disadvantages.map((disadvantage) => (
          <p className="text-white font-medium text-lg mb-[1vw]" key={disadvantage}>
            {disadvantage}
          </p>
        ))}
      </div>
    </div>
  </div>
)

interface NavigationButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  direction: 'left' | 'right'
}

const NavigationButton = ({ direction, ...rest }: NavigationButtonProps) => (
  <button
    {...rest}
    className="w-[3vw] h-[3vw] bg-black bg-opacity-25 border-darkPurple border-[0.14vw] rounded-[0.6vw] flex items-center justify-center">
    {direction === 'left'
      ? <ChevronLeft size={'2.2vw'} color="white"/>
      : <ChevronRight size={'2.2vw'} color="white"/>
    }
  </button>
)

export default HowItWorks
