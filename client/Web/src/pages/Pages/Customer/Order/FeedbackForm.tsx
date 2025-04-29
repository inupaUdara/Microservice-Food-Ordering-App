import React, { useState } from 'react';
import api from '../../../../services/axiosInstance';
import axios from 'axios';
import { IRootState } from '../../../../store';
import { useSelector } from 'react-redux';

const FeedbackForm = ({ orderId, restaurantId, userId }: { orderId: string, restaurantId: string, userId: string }) => {
    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
  const [name, setName] = useState(currentUser?.firstName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('rating', rating.toString());
    formData.append('message', message);
    if (image) {
      formData.append('images', image);
    }
    formData.append('orderId', orderId);
    formData.append('restaurantId', restaurantId);
    formData.append('userId', userId);

    try {
      await axios.post('http://127.0.0.1:3000/feedback-service/api/v1/feedback', formData); // Don't set headers manually
      setResponseMessage('Feedback submitted successfully!');
      setName('');
      setEmail('');
      setRating(5);
      setMessage('');
      setImage(null);
    } catch (error) {
      console.error(error);
      setResponseMessage('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
      {responseMessage && <p className="mb-2 text-green-600">{responseMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          placeholder="Name"
          defaultValue={currentUser?.firstName}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          defaultValue={currentUser?.email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          value={rating}
          min={1}
          max={5}
          placeholder="Rating"
          required
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <textarea
          value={message}
          placeholder="Your feedback..."
          required
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
