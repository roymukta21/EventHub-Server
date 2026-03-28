import { Response } from "express";
import Booking from "../models/booking.model";
import { AuthRequest } from ".";
import { sendSuccess, sendError } from "../utils/response";

export const createBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const booking = await Booking.create({ ...req.body, userId: req.user?.id });
    sendSuccess(res, "Booking created", booking, 201);
  } catch {
    sendError(res, "Failed to create booking");
  }
};

export const getBookings = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const filter = req.user?.role === "ADMIN" ? {} : { userId: req.user?.id };
    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .populate("itemId", "title price image")
      .sort({ createdAt: -1 });
    sendSuccess(res, "Bookings fetched", bookings);
  } catch {
    sendError(res, "Failed to fetch bookings");
  }
};

export const updateBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!booking) {
      sendError(res, "Booking not found", 404);
      return;
    }
    sendSuccess(res, "Booking updated", booking);
  } catch {
    sendError(res, "Failed to update booking");
  }
};

export const deleteBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      sendError(res, "Booking not found", 404);
      return;
    }
    sendSuccess(res, "Booking deleted", booking);
  } catch {
    sendError(res, "Failed to delete booking");
  }
};
