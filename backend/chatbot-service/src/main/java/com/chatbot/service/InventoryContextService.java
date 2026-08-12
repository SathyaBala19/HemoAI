package com.chatbot.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;

// Fetches real, current blood-stock levels from inventory-service so the
// chatbot's answers are grounded in actual data instead of the model
// inventing plausible-sounding numbers. Without this, asking "what's
// below threshold?" got a confident but completely made-up answer -
// the model has no memory of this app's data unless we hand it over
// explicitly on every request.
//
// Same HttpURLConnection approach as OllamaService (not java.net.http) -
// see the comment there for why.
@Service
public class InventoryContextService {

    @Value("${inventory.base-url}")
    private String baseUrl;

    // Returns a short plain-text summary of current stock, or null if it
    // couldn't be fetched (e.g. inventory-service is down, or the caller
    // - a DONOR - isn't allowed to read it). Callers should treat null as
    // "no live data available" and just skip adding it to the prompt,
    // rather than failing the whole chat request over it.
    public String fetchSummary(String bearerToken) {
        try {
            HttpURLConnection connection = (HttpURLConnection) URI.create(baseUrl + "/api/inventory").toURL().openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Authorization", "Bearer " + bearerToken);
            connection.setConnectTimeout(3000);
            connection.setReadTimeout(5000);

            int statusCode = connection.getResponseCode();
            if (statusCode != 200) {
                return null;
            }

            String body = readAll(connection.getInputStream());
            JsonArray rows = JsonParser.parseString(body).getAsJsonArray();
            if (rows.isEmpty()) {
                return null;
            }

            StringBuilder summary = new StringBuilder("Current blood inventory (live, right now):\n");
            for (JsonElement el : rows) {
                JsonObject row = el.getAsJsonObject();
                String group = row.get("bloodGroup").getAsString();
                int units = row.get("units").getAsInt();
                int minimum = row.get("minimumThreshold").getAsInt();
                String status = units < minimum ? " - BELOW THRESHOLD" : "";
                summary.append("- ").append(group).append(": ").append(units)
                        .append(" units (minimum ").append(minimum).append(")").append(status).append("\n");
            }
            return summary.toString();
        } catch (IOException | RuntimeException e) {
            // Any failure here (network, bad JSON, 403 for a DONOR caller)
            // just means "no live data this time" - never let it break
            // the chat response itself.
            return null;
        }
    }

    private static String readAll(InputStream stream) throws IOException {
        if (stream == null) {
            return "";
        }
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        try (stream) {
            stream.transferTo(buffer);
        }
        return buffer.toString(StandardCharsets.UTF_8);
    }
}
