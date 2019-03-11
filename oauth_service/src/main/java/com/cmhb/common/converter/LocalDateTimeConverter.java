package com.cmhb.common.converter;

import org.springframework.core.convert.converter.Converter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class LocalDateTimeConverter implements Converter<String, LocalDateTime> {
    private static final List<DateTimeFormatter> formarts = new ArrayList<DateTimeFormatter>(4);

    static {
        formarts.add(DateTimeFormatter.ofPattern("yyyy-MM"));
        formarts.add(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        formarts.add(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        formarts.add(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @Override
    public LocalDateTime convert(String source) {
        String value = source.trim();
        if ("".equals(value)) {
            return null;
        }
        if (source.matches("^\\d{4}-\\d{1,2}$")) {
            return LocalDateTime.parse(source, formarts.get(0));
        } else if (source.matches("^\\d{4}-\\d{1,2}-\\d{1,2}$")) {
            return LocalDateTime.parse(source, formarts.get(1));
        } else if (source.matches("^\\d{4}-\\d{1,2}-\\d{1,2} {1}\\d{1,2}:\\d{1,2}$")) {
            return LocalDateTime.parse(source, formarts.get(2));
        } else if (source.matches("^\\d{4}-\\d{1,2}-\\d{1,2} {1}\\d{1,2}:\\d{1,2}:\\d{1,2}$")) {
            return LocalDateTime.parse(source, formarts.get(3));
        } else {
            throw new IllegalArgumentException("Invalid boolean value '" + source + "'");
        }
    }
}
