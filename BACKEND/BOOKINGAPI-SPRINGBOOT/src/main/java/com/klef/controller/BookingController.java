package com.klef.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.klef.entity.Booking;
import com.klef.service.BookingService;


@RestController
@RequestMapping("/bookingapi")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/")
    public String home() {
        return "Restaurant Booking API is running...";
    }

    @PostMapping("/add")
    public ResponseEntity<Booking> addBooking(@RequestBody Booking booking) {
        Booking savedBooking = bookingService.addBooking(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking != null) {
            return new ResponseEntity<>(booking, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Booking with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateBooking(@RequestBody Booking booking) {
        Booking existing = bookingService.getBookingById(booking.getId());
        if (existing != null) {
            Booking updatedBooking = bookingService.updateBooking(booking);
            return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot update. Booking with ID " + booking.getId() + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable String id) {
        Booking existing = bookingService.getBookingById(id);
        if (existing != null) {
            bookingService.deleteBookingById(id);
            return new ResponseEntity<>("Booking with ID " + id + " deleted successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot delete. Booking with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }
}
