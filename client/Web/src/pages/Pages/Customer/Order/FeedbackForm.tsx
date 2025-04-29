import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ orderId }: { orderId: string }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackImage, setFeedbackImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('feedback', feedbackText);
    if (feedbackImage) {
      formData.append('image', feedbackImage);
    }

    try {
      const response = await axios.post('/api/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Feedback submitted successfully!');
      setFeedbackText('');
      setFeedbackImage(null);
    } catch (error: any) {
      console.error(error);
      setMessage('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Leave Feedback</h2>
      {message && (
        <div className="mb-4 text-sm text-center text-green-600">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border rounded-lg p-2"
          rows={4}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFeedbackImage(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
