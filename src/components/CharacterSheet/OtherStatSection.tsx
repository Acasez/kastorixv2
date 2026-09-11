export default function OtherStatSection() {
  return (
    <div className="flex flex-col bg-gray-800 h-90 w-165 gap-3 border-x-2 rounded-lg -mt-2">
      <h1 className="text-striking text-center text-3xl underline">
        Status effects
      </h1>
      <div className="flex w-9/10 h-12 rounded-2xl bg-gray-400 mx-8 items-center">
        <button className="text-2xl m-2 px-3 py-1 bg-black text-text-light rounded-lg">
          +
        </button>
      </div>
    </div>
  );
}
