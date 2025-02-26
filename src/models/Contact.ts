import mongoose from 'mongoose';

export interface IContact extends mongoose.Document {
  name: string;
  email: string;
  orderNumber?: string;
  inquiryType: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    orderNumber: {
      type: String,
      trim: true,
    },
    inquiryType: {
      type: String,
      required: [true, 'Please provide an inquiry type'],
      enum: ['Order Status', 'Returns & Exchanges', 'Product Information', 'Shipping & Delivery', 'Other'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema); 