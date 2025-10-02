using System.Text.Json;
using System.Text.Json.Serialization;
using PortalAPI.Models;

namespace PortalAPI.Converters;

public class PriorityConverter : JsonConverter<Priority>
{
    public override Priority Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return value?.ToLower() switch
        {
            "low" => Priority.Low,
            "medium" => Priority.Medium,
            "high" => Priority.High,
            _ => Priority.Medium
        };
    }

    public override void Write(Utf8JsonWriter writer, Priority value, JsonSerializerOptions options)
    {
        var stringValue = value switch
        {
            Priority.Low => "low",
            Priority.Medium => "medium",
            Priority.High => "high",
            _ => "medium"
        };
        writer.WriteStringValue(stringValue);
    }
}

public class TodoStatusConverter : JsonConverter<TodoStatus>
{
    public override TodoStatus Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return value?.ToLower() switch
        {
            "pending" => TodoStatus.Pending,
            "in-progress" => TodoStatus.InProgress,
            "completed" => TodoStatus.Completed,
            _ => TodoStatus.Pending
        };
    }

    public override void Write(Utf8JsonWriter writer, TodoStatus value, JsonSerializerOptions options)
    {
        var stringValue = value switch
        {
            TodoStatus.Pending => "pending",
            TodoStatus.InProgress => "in-progress",
            TodoStatus.Completed => "completed",
            _ => "pending"
        };
        writer.WriteStringValue(stringValue);
    }
}
