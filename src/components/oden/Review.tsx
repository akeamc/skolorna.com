import { Meal, Review as ReviewType, deleteReview } from "@/lib/oden";
import { DateTime } from "luxon";
import Stars from "../stars/Stars";
import classNames from "classnames";
import { useAuth } from "@/lib/auth/context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onReviewChange } from "@/lib/oden/hooks";
import { MoreHorizontal } from "react-feather";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Review({
  review,
  menu,
  meal,
  highlighted,
}: {
  review: ReviewType;
  menu: string;
  meal: Meal;
  highlighted?: boolean;
}) {
  const { userId, accessToken } = useAuth();
  const isOwnReview = review.author === userId;
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => {
      if (!accessToken) throw new Error("Not authenticated");
      return deleteReview(id, accessToken);
    },
    onSuccess: (_, id) =>
      onReviewChange(client, menu, meal, (old) =>
        old.filter((r) => r.id !== id)
      ),
  });

  return (
    <div className="relative rounded-md border border-gray-200 p-2">
      <h4 className="text-sm font-medium">{isOwnReview ? "Du" : ""}</h4>
      <div className="flex items-center gap-2">
        <Stars filled={review.rating} size={12} />
        <time
          className={classNames(
            "text-sm",
            highlighted
              ? "rounded-md bg-blue-100 px-1 py-0.5 font-medium text-blue-500"
              : "text-gray-500"
          )}
        >
          {DateTime.fromISO(review.date).toLocaleString(DateTime.DATE_MED)}
        </time>
      </div>
      <Menu as="div" className="absolute right-0 top-0 inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:text-gray-900">
            <MoreHorizontal className="h-5 w-5" aria-label="Alternativ" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => mutate(review.id)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "flex w-full items-center px-4 py-2 text-left text-xs font-medium"
                    )}
                  >
                    Radera
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
