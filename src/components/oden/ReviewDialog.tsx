import { Fragment, FunctionComponent, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Meal, ODEN_URL, Review } from "@/lib/oden";
import { X } from "react-feather";
import Stars from "../stars/Stars";
import { useQuery } from "@tanstack/react-query";

const ReviewDialog: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
  meal: Meal;
}> = ({ open, setOpen, meal }) => {
  const cancelButtonRef = useRef(null);
  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["oden", "reviews", meal.value],
    queryFn: async () => {
      const res = await fetch(`${ODEN_URL}/reviews?meal=${meal.value}`);
      return res.json();
    },
    enabled: open,
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-900 focus-visible:ring-blue-700"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {meal.value}
                    </Dialog.Title>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <span className="mb-1 text-3xl font-normal">
                      {typeof meal.rating === "number"
                        ? meal.rating?.toLocaleString("sv", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })
                        : "–"}
                    </span>
                    <span className="text-xs font-normal text-gray-400">
                      {meal.reviews}{" "}
                      {meal.reviews === 1 ? "recension" : "recensioner"}
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReviewDialog;