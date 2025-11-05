package com.klef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    Booking findByEmail(String email);
    Booking findByPhone(String phone);
}
