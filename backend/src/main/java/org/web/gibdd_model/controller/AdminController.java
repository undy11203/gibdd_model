package org.web.gibdd_model.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.web.gibdd_model.dto.SqlQueryRequestDTO;
import org.web.gibdd_model.dto.SqlQueryResponseDTO;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

//
    @PostMapping("/execute-query")
    @PreAuthorize("hasPermission('EXECUTE_QUERIES', '')")
    public ResponseEntity<SqlQueryResponseDTO> executeQuery(@RequestBody SqlQueryRequestDTO request) {
        try {
            String query = request.getQuery();
            
            // Проверяем, что запрос не пустой
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(SqlQueryResponseDTO.error("Query cannot be empty"));
            }

            // Проверяем тип запроса
            String normalizedQuery = query.trim().toLowerCase();
            if (normalizedQuery.startsWith("select")) {
                // Для SELECT запросов возвращаем результаты
                List<Map<String, Object>> results = jdbcTemplate.queryForList(query);
                return ResponseEntity.ok(SqlQueryResponseDTO.success(results));
            } else {
                // Для остальных запросов (INSERT, UPDATE, DELETE) возвращаем количество затронутых строк
                int rowsAffected = jdbcTemplate.update(query);
                return ResponseEntity.ok(SqlQueryResponseDTO.success(rowsAffected));
            }
        } catch (Exception e) {
            // В случае ошибки возвращаем сообщение об ошибке
            return ResponseEntity.badRequest()
                .body(SqlQueryResponseDTO.error(e.getMessage()));
        }
    }
}
