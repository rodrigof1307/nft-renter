const Usecases = () => (
  <div className="flex flex-col items-center justify-between w-[55vw] mx-auto">
    <h2 className="font-highlight font-extrabold text-3xl text-brightPink">
      UTILITY AT A FRACTION OF THE COST
    </h2>
    <div className="flex flex-row justify-between w-[55vw] py-[2vw]">
      <Usecase title="Gaming Assets" emoji="🎮" />
      <Usecase title="Digital art" emoji="🖼" />
      <Usecase title="Tickets" emoji="🎟" />
      <Usecase title="Profile Pictures" emoji="📷" />
      <Usecase title="Memberships" emoji="🗝" />
    </div>
    <h2 className="font-highlight font-extrabold text-3xl text-brightBlue">
      EARN PASSIVELY WHILE YOU HOLD
    </h2>
  </div>
)

type UsecaseProps = {
  title: string
  emoji: string
}

const Usecase = ({ title, emoji }: UsecaseProps) => (
  <div className="flex flex-col items-center justify-between">
    <h3 className="text-5xl">{emoji}</h3>
    <h4 className="text-md mt-[0.25vw] text-white">{title}</h4>
  </div>
)

export default Usecases
