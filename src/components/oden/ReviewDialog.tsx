import { FunctionComponent, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Meal, ODEN_URL, Review } from "@/lib/oden";
import { useQuery } from "@tanstack/react-query";
import Modal from "../Modal";

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
  const ratingHistogram = (reviews || []).reduce(
    (acc, review) => {
      acc[review.rating - 1] += 1;
      return acc;
    },
    Array.from({ length: 5 }, () => 0)
  );

  return (
    <Modal open={open} setOpen={setOpen} initialFocus={cancelButtonRef}>
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <Dialog.Title
          as="h3"
          className="mb-3 mr-6 text-base font-semibold leading-6 text-gray-900"
        >
          {meal.value}
        </Dialog.Title>
        <div className="flex gap-2">
          <table className="grow">
            <tbody>
              {ratingHistogram.map((count, i) => (
                <tr key={i}>
                  <td className="pr-3 text-sm">{i + 1}</td>
                  <td className="w-full">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        style={{
                          width: reviews?.length
                            ? `${(count / reviews.length) * 100}%`
                            : 0,
                        }}
                        className="h-2 rounded-full bg-gray-900 transition-all"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex w-32 flex-col items-center justify-center text-center">
            <span className="mb-1 text-3xl font-normal">
              {typeof meal.rating === "number"
                ? meal.rating?.toLocaleString("sv", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })
                : "–"}
            </span>
            <span className="text-xs font-normal text-gray-400">
              {meal.reviews} {meal.reviews === 1 ? "recension" : "recensioner"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewDialog;
