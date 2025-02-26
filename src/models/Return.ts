import mongoose from 'mongoose';

export interface IReturn extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    size: string;
    price: number;
    reason: string;
  }[];
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'completed' | 'rejected';
  shippingMethod: string;
  returnLabel?: string;
  approvedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const returnSchema = new mongoose.Schema<IReturn>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      reason: {
        type: String,
        required: true,
        enum: [
          'Wrong size',
          'Not as described',
          'Changed mind',
          'Defective/damaged',
          'Received wrong item',
          'Other',
        ],
      },
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'shipped', 'received', 'completed', 'rejected'],
      default: 'pending',
    },
    shippingMethod: {
      type: String,
      required: true,
    },
    returnLabel: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
returnSchema.index({ user: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ createdAt: -1 });

export default mongoose.models.Return || mongoose.model<IReturn>('Return', returnSchema); 