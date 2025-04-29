import { useEffect, useState } from 'react';
import DriverDashboard from './Location/DriverDashboard';
import { getDeliveryByDriverId, updateDeliveryStatus } from '../../../services/delivery/delivery';
import { getOrderById } from '../../../services/order/order';
import Loader from '../../Components/Loader';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Dialog } from '@headlessui/react';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Location {
  latitude: number;
  longitude: number;
}

interface Delivery {
  pickupLocation: Location;
  deliveryLocation: Location;
  _id: string;
  orderId: string;
  driverId: string;
  status: string;
  estimatedTime: number;
  createdAt: string;
}

const Orders = () => {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [currentUserLocation, setCurrentUserLocation] = useState<Location | null>(null);
  const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getDeliveryByDriverId(currentUser?.driverProfile?._id);
        setDelivery(data);
      } catch (err) {
        setError('Failed to fetch deliveries');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.driverProfile?._id) {
      fetchDeliveries();
    }
  }, [currentUser?.driverProfile?._id]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(delivery.orderId);
        setOrder(data);
        setError('');
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (delivery?.orderId) {
      fetchOrder();
    }
  }, [delivery?.orderId]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setIsConfirmOpen(true); // Open confirmation modal
  };

  const handleConfirmUpdate = () => {
    if (!selectedStatus || !delivery) return;

    setUpdatingStatus(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        try {
          await updateDeliveryStatus(delivery._id, selectedStatus, location);
          alert('Delivery status updated successfully');
          window.location.reload(); // or re-fetch delivery if you want smoother update
        } catch (error) {
          console.error('Error updating status:', error);
          alert('Failed to update delivery status');
        } finally {
          setUpdatingStatus(false);
          setIsConfirmOpen(false);
        }
      },
      (error) => {
        console.error('Error fetching location:', error);
        alert('Could not fetch current location.');
        setUpdatingStatus(false);
      }
    );
  };

  // Fetch current user location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Error fetching user location:', err);
          setError('Unable to fetch current location. Using default location.');
          // Fallback to a default location (e.g., city center)
          setCurrentUserLocation({ latitude: 51.505, longitude: -0.09 });
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Map component
  const MapView = () => {
    const mapRef = useEffect(() => {
      if (!delivery || !order || !currentUserLocation) return;

      const map = L.map('map').setView(
        [currentUserLocation.latitude, currentUserLocation.longitude],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add markers
      L.marker([currentUserLocation.latitude, currentUserLocation.longitude])
        .addTo(map)
        .bindPopup('Current Location')
        .openPopup();

      L.marker([delivery.pickupLocation.latitude, delivery.pickupLocation.longitude])
        .addTo(map)
        .bindPopup(`Pickup: ${order.shippingAddress.street}, ${order.shippingAddress.city}`);

      L.marker([delivery.deliveryLocation.latitude, delivery.deliveryLocation.longitude])
        .addTo(map)
        .bindPopup(`Restaurant: ${order.restaurant.address.street}, ${order.restaurant.address.city}`);

      // Add routing
      L.Routing.control({
        waypoints: [
          L.latLng(currentUserLocation.latitude, currentUserLocation.longitude),
          L.latLng(delivery.pickupLocation.latitude, delivery.pickupLocation.longitude),
          L.latLng(delivery.deliveryLocation.latitude, delivery.deliveryLocation.longitude),
        ],
        routeWhileDragging: true,
      }).addTo(map);

      return () => {
        map.remove();
      };
    }, []);

    return <div id="map" className="h-96 w-full rounded-lg shadow-md" />;
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-600">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <DriverDashboard />
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Active Delivery</h1>

        {delivery ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Order ID: {delivery.orderId}</h2>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    delivery.status === 'assigned'
                      ? 'bg-yellow-200 text-yellow-800'
                      : delivery.status === 'in-transit'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {delivery.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium mb-1">Pickup Location</h3>
                  <p className="text-sm text-gray-600">
                    Lat: {delivery.pickupLocation.latitude.toFixed(6)}
                    <br />
                    Lng: {delivery.pickupLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Street: {order?.shippingAddress.street}
                    <br />
                    City: {order?.shippingAddress.city}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Delivery Location</h3>
                  <p className="text-sm text-gray-600">
                    Lat: {delivery.deliveryLocation.latitude.toFixed(6)}
                    <br />
                    Lng: {delivery.deliveryLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Street: {order?.restaurant.address.street}
                    <br />
                    City: {order?.restaurant.address.city}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <div>
                  <p className="text-gray-600">Estimated Time: {formatTime(delivery.estimatedTime)}</p>
                </div>
                <div>
                  <p className="text-gray-500">
                    Created: {new Date(delivery.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Button to toggle map view */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {showMap ? 'Hide Map' : 'View Map'}
              </button>

              {/* Conditionally render map */}
              {showMap && delivery && order && currentUserLocation && <MapView />}

              <div className="my-4">
  <label className="block text-sm font-medium mb-2">Update Status:</label>
  <select
    value={selectedStatus}
    onChange={handleStatusChange}
    className="border rounded px-3 py-2 w-full"
  >
    <option value="">Select Status</option>
    <option value="picked-up">Picked Up</option>
    <option value="in-transit">In Transit</option>
    <option value="delivered">Delivered</option>
  </select>
</div>

{/* Confirmation Modal */}
{isConfirmOpen && (
  <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen p-4">
      <Dialog.Panel className="bg-white p-6 rounded shadow-lg">
        <Dialog.Title className="text-lg font-bold">Confirm Update</Dialog.Title>
        <Dialog.Description className="text-sm text-gray-600 my-4">
          Are you sure you want to update the delivery status to <span className="font-semibold">{selectedStatus}</span>?
        </Dialog.Description>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleConfirmUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={updatingStatus}
          >
            {updatingStatus ? 'Updating...' : 'Yes, Update'}
          </button>
          <button
            onClick={() => setIsConfirmOpen(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
)}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No deliveries found</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
