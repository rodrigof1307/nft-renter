const Usecases = () => (
  <div className="mx-auto flex w-[55vw] flex-col items-center justify-between">
    <h2 className="font-highlight text-3xl font-extrabold text-brightPink">
      UTILITY AT A FRACTION OF THE COST
    </h2>
    <div className="flex w-[55vw] flex-row justify-between py-[2.5vw]">
      <Usecase title="Gaming Assets" emoji="🎮" />
      <Usecase title="Digital art" emoji="🖼" />
      <Usecase title="Tickets" emoji="🎟" />
      <Usecase title="Profile Pictures" emoji="📷" />
      <Usecase title="Memberships" emoji="🗝" />
    </div>
    <h2 className="font-highlight text-3xl font-extrabold text-brightBlue">
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
    <h3 className="text-5xl">{emoji}</h3>
    <h4 className="mt-[0.25vw] text-md ">{title}</h4>
  </div>
);

export default Usecases;
