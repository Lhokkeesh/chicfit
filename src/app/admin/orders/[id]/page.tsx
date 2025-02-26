'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Order } from '@/types/order';
import Image from 'next/image';

const statusColors = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  processing: { bg: '#DBEAFE', text: '#1E40AF' },
  shipped: { bg: '#D1FAE5', text: '#065F46' },
  delivered: { bg: '#ECFDF5', text: '#064E3B' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const data = await api.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await fetchOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Order not found'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Order #{order._id.slice(-6)}
        </h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center">
                  <div className="h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                    {item.selectedSize && (
                      <div className="mt-1 text-sm text-gray-500">
                        Size: {item.selectedSize}
                      </div>
                    )}
                    {item.selectedColor && (
                      <div className="mt-1 text-sm text-gray-500">
                        Color: {item.selectedColor}
                      </div>
                    )}
                  </div>
                  <div className="ml-6 text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <div className="text-base font-medium text-gray-900">Total</div>
                <div className="text-base font-medium text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              style={{
                backgroundColor: statusColors[order.status].bg,
                color: statusColors[order.status].text,
              }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="mt-2 text-sm text-gray-500">
              Created on {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer</h2>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
              <div className="text-sm text-gray-500">{order.user.email}</div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-2 text-sm text-gray-500">
              <div>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
              <div>{order.shippingAddress.address}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
              <div>{order.shippingAddress.country}</div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {order.paymentStatus}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Method</div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {order.paymentMethod}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 