import mongoose from 'mongoose';

export interface INewsletter extends mongoose.Document {
  email: string;
  subscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const newsletterSchema = new mongoose.Schema<INewsletter>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
newsletterSchema.index({ email: 1 }, { unique: true });
newsletterSchema.index({ subscribed: 1 });

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', newsletterSchema); 