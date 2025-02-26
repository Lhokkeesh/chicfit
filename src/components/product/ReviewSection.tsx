import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import { useToast } from '@/hooks/useToast';
import { Box, Typography, TextField, Button, Rating } from '@mui/material';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast('error', 'Failed to load reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      showToast('error', 'Please sign in to leave a review');
      return;
    }

    if (rating === 0) {
      showToast('error', 'Please select a rating');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showToast('success', 'Review submitted successfully');
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('error', 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Customer Reviews
      </Typography>

      {session && (
        <Box component="form" onSubmit={handleSubmitReview} sx={{ mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Your Rating</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue || 0)}
              precision={1}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 1 }}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        {reviews.length === 0 ? (
          <Typography color="text.secondary">No reviews yet</Typography>
        ) : (
          reviews.map((review) => (
            <Box
              key={review._id}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  by {review.user.name}
                </Typography>
              </Box>
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
} 