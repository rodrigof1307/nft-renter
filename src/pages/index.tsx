import { Button } from '@/components/Button'
import Lines from '../../public/lines.svg'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'
import Usecases from '@/components/landing-page/Usecases'
import HowItWorks from '@/components/landing-page/HowItWorks'

export default function Home() {
  return (
    <div className="relative -mt-[7vw] pt-[7vw] initial-animation">
      <Lines className="lines absolute top-0 right-0" width={'28.34vw'} height={'80vw'} viewBox="0 0 524 1482"/>
      <div className="h-[calc(63vh-7vw)] min-h-[25vw] max-h-[30vw] pt-[1vh] forced-opacity px-[4vw]">
        <Typewriter
          onInit={(typewriter) => {
            typewriter.typeString('The Ultimate<br/>NFT Rental<br/>Protocol')
              .start()
          }}
          options={{
            delay: 65,
            wrapperClassName: 'text-white font-highlight font-extrabold text-[6vw] leading-[6vw] py-[1.5vh]',
          }}
        />
        <h4 className="text-white text-xl leading-[1.4vw] initial-animation mt-[2.5vh]">
          The NFT Renter Protocol provides a rental solution for every renter and lenter.<br/><br/>
          Explore our collateralized and non collaterlized options and find what fits you!
        </h4>
      </div>
      <div className="h-[37vh] min-h-[15vw] max-h-[18vw] mb-[4vw] relative flex flex-col justify-evenly items-center">
        <div className="absolute -bottom-[18vw] -left-[17vw] w-[40vw] h-[40vw]">
          <Image fill style={{ objectFit: 'contain' }} alt="Object" src="/object.png" unoptimized={true} loading="eager"/>
        </div>
        <Button tone="blue" roundness="full" size="large" className="mr-[25%]">
          I WANT TO LEND<br/>MY NFTS
        </Button>
        <Button tone="pink" roundness="full" size="large" className="ml-[25%]">
          I WANT TO RENT<br/>OTHER NFTS
        </Button>
      </div>
      <Usecases/>
      <HowItWorks/>
    </div>
  )
}
