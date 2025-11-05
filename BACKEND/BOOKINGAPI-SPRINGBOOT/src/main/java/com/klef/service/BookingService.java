package com.klef.service;

import java.util.List;
import com.klef.entity.Booking;

public interface BookingService {
    Booking addBooking(Booking booking);
    List<Booking> getAllBookings();
    Booking getBookingById(String id);
    Booking updateBooking(Booking booking);
    void deleteBookingById(String id);
}
