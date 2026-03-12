package com.authify.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.authify.entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Long> {

    // ✅ NO static
    // ✅ NO method body
    // ✅ Spring implements this automatically
    Optional<UserEntity> findByEmail(String email);

    Boolean existsByEmail(String email);
}
