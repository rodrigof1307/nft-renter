const Usecases = () => (
  <div className="mx-auto flex w-full flex-col items-center justify-between">
    <h2 className="text-center font-highlight text-mb-2xl font-extrabold text-brightPink md:text-3xl">
      UTILITY AT A FRACTION OF THE COST
    </h2>
    <div className="flex w-full flex-row justify-center gap-[5vw] py-[2vh] md:py-[2.5vw]">
      <Usecase title="Gaming Assets" emoji="🎮" />
      <Usecase title="Digital art" emoji="🖼" />
      <Usecase title="Tickets" emoji="🎟" />
      <Usecase title="Profile Pictures" emoji="📷" />
      <Usecase title="Memberships" emoji="🗝" />
    </div>
    <h2 className="text-center font-highlight text-mb-2xl font-extrabold text-brightBlue md:text-3xl">
      EARN PASSIVELY WHILE YOU HOLD
    </h2>
  </div>
);

interface UsecaseProps {
  title: string;
  emoji: string;
}

const Usecase = ({ title, emoji }: UsecaseProps) => (
  <div className="flex flex-col items-center justify-between">
    <h3 className="text-mb-5xl md:text-5xl">{emoji}</h3>
    <h4 className="mt-[2vw] text-mb-md md:mt-[0.25vw] md:text-md ">{title}</h4>
  </div>
);

export default Usecases;
