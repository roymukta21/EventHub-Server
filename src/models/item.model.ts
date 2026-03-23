import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description: string;
  image?: string;
  price: number;
  rating: number;
  location?: string;
  category: string;
  createdBy: mongoose.Types.ObjectId;
}

const itemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    location: { type: String },
    category: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model<IItem>('Item', itemSchema);
