package org.web.gibdd_model.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Бэкенд для гос. сервиса ГИБДД")
                        .version("1.0")
                        .description("Этот swagger был написан с целью понять какое api уже есть")
                        .contact(new Contact()
                                .name("Дима")
                                .email("user@example.com")));
    }
}

