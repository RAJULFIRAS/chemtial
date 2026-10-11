import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";
import { reviewApi } from "../../services/adminApi";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItemId: string;
  productName: string;
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  orderItemId,
  productName,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error(t("review.rating_error"));
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewApi.create({
        orderItemId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success(t("review.success"));
      onSuccess();
      onClose();
      setRating(5);
      setComment("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("review.failed");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-secondary">
            {t("review.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t("review.close")}
          >
            <X size={20} />
          </button>
        </div>

        <p
          className="text-sm text-secondary/70 mb-4"
          dangerouslySetInnerHTML={{
            __html: t("review.subtitle", { product: productName }),
          }}
        />

        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
                aria-label={t("review.star_label", { value })}
              >
                <Star
                  size={36}
                  className={
                    value <= displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          <div className="text-center mb-4">
            <span className="text-sm font-medium text-secondary">
              {t("review.rating_label", { rating: displayRating })}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary mb-1.5">
              {t("review.comment_label")}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              placeholder={t("review.comment_placeholder")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
            />
            <div className="text-xs text-secondary/60 text-right mt-1">
              {comment.length}/1000
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {t("review.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              )}
              {t("review.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
