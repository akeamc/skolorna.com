"use client";

import { FormEvent, FunctionComponent, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  CreateReview,
  Meal,
  ODEN_URL,
  Review as ReviewType,
  createReview,
} from "@/lib/oden";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "../Modal";
import { useAuth } from "@/lib/auth/context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Stars from "../stars/Stars";
import Review from "./Review";
import { onReviewChange } from "@/lib/oden/hooks";
import Spinner from "../Spinner";

const Rating: FunctionComponent<{ meal: Meal; reviews?: ReviewType[] }> = ({
  meal,
  reviews = [],
}) => {
  const ratingHistogram = (reviews || []).reduce(
    (acc, review) => {
      acc[review.rating - 1] += 1;
      return acc;
    },
    Array.from({ length: 5 }, () => 0)
  );

  return (
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
        <span className="mb-1 text-3xl font-semibold">
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
  );
};

const ReviewForm: FunctionComponent<{
  menu: string;
  date: string;
  meal: Meal;
}> = ({ menu, date, meal }) => {
  const { status, userId, accessToken } = useAuth();
  const [rating, setRating] = useState(0);
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (review: CreateReview) => {
      if (!accessToken) throw new Error("Not authenticated");
      return createReview(review, accessToken);
    },
    onSuccess: (review) =>
      onReviewChange(client, menu, meal, (old) => [review, ...old]),
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    mutate({
      menu_id: menu,
      meal: meal.value,
      date,
      rating,
      comment: (data.get("comment") as string) || undefined,
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Stars name="rating" filled={rating} onChange={setRating} size={20} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-900">
          Kommentar
        </span>
        <textarea
          name="comment"
          className="fous:ring-inset block w-full rounded-md border-none p-2 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          rows={3}
        />
      </label>
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        disabled={isPending || rating === 0}
      >
        Publicera
        {isPending && <Spinner className="ml-2" currentColor />}
      </button>
    </form>
  );
};

const ReviewDialog: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
  menu: string;
  date: string;
  meal: Meal;
}> = ({ open, setOpen, menu, date, meal }) => {
  const { status, userId } = useAuth();
  const cancelButtonRef = useRef(null);
  const { data: reviews } = useQuery<ReviewType[]>({
    queryKey: ["oden", "reviews", meal.value],
    queryFn: async () => {
      const res = await fetch(`${ODEN_URL}/reviews?meal=${meal.value}`);
      return res.json();
    },
    enabled: open,
  });
  const path = usePathname();
  const mayReview =
    status === "authenticated" &&
    !reviews?.some(
      (review) => review.author === userId && review.date === date
    );
  const ownReviews = reviews?.filter((review) => review.author === userId);

  return (
    <Modal open={open} setOpen={setOpen} initialFocus={cancelButtonRef}>
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <Dialog.Title
          as="h3"
          className="mb-3 mr-6 text-base font-semibold leading-6 text-gray-900"
        >
          {meal.value}
        </Dialog.Title>
        <Rating meal={meal} reviews={reviews} />
        <div className="mt-4">
          {(status === "unauthenticated" || mayReview) && (
            <>
              <hr className="my-4 border-t-gray-300" />
              <h4 className="mb-2 text-base font-medium tracking-tight text-gray-900">
                Skriv en recension
              </h4>
            </>
          )}
          {status === "unauthenticated" && (
            <p className="text-sm text-gray-500">
              <Link className="underline" href={`/login?next=${path}`}>
                Logga in
              </Link>{" "}
              för att skriva en recension.
            </p>
          )}
          {mayReview && <ReviewForm menu={menu} date={date} meal={meal} />}

          {(ownReviews?.length || 0) > 0 && (
            <>
              <hr className="my-4 border-t-gray-300" />
              <h4 className="mb-2 text-base font-medium tracking-tight text-gray-900">
                Recensioner
              </h4>
              <div className="space-y-4">
                {reviews
                  ?.filter((review) => review.author === userId)
                  .map((review) => (
                    <Review
                      key={review.id}
                      review={review}
                      highlighted={review.date === date}
                      menu={menu}
                      meal={meal}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewDialog;
