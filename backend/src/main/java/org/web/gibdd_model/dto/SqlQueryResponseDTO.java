package org.web.gibdd_model.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlQueryResponseDTO {
    private boolean success;
    private String message;
    private Integer rowsAffected;
    private List<Map<String, Object>> results;
    private String error;

    public static SqlQueryResponseDTO success(List<Map<String, Object>> results) {
        return SqlQueryResponseDTO.builder()
                .success(true)
                .results(results)
                .build();
    }

    public static SqlQueryResponseDTO success(int rowsAffected) {
        return SqlQueryResponseDTO.builder()
                .success(true)
                .message("Query executed successfully")
                .rowsAffected(rowsAffected)
                .build();
    }

    public static SqlQueryResponseDTO error(String errorMessage) {
        return SqlQueryResponseDTO.builder()
                .success(false)
                .error(errorMessage)
                .build();
    }
}
