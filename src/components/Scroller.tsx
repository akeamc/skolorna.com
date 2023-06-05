import { FunctionComponent } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

const Scroller: FunctionComponent<{
  onScroll: (steps: number) => void;
  onReset: () => void;
}> = ({ onScroll, onReset }) => {
  return (
    <div className="inline-flex items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
      <button
        className="p-1.5 text-gray-400 hover:bg-gray-100"
        onClick={() => onScroll(-1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <hr className="h-6 border-l sm:hidden" />
      <button
        className="px-3 py-1.5 text-sm font-semibold  text-gray-900 hover:bg-gray-100 max-sm:hidden"
        onClick={onReset}
      >
        Idag
      </button>
      <button
        className="p-1.5 text-gray-400 hover:bg-gray-100"
        onClick={() => onScroll(1)}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Scroller;
