using System.Text.Json.Serialization;

namespace Rates.Publisher;

public class Rate
{
    public string ClientId { get; set; }

    //[JsonPropertyName("rateId")]
    public string RateId { get; set; }

    //[JsonPropertyName("valueDate")]
    public string ValueDate { get; set; }

    //[JsonPropertyName("primary")]
    public string Primary { get; set; }

    //[JsonPropertyName("secondary")]
    public string Secondary { get; set; }

    //[JsonPropertyName("tenor")]
    public string Tenor { get; set; }

    //[JsonPropertyName("tiers")]
    public IEnumerable<Tier> Tiers { get; set; }

    //[JsonPropertyName("token")]
    public string Token { get; set; }

    [JsonPropertyName("status")]
    public int Status { get; set; }

    //[JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }

    public string Topic { get; set; }

    //[JsonPropertyName("liquidityLimitInBaseCcy")]
    public decimal LiquidityLimitInBaseCcy { get; set; }

    //[JsonPropertyName("pointMultiplier")]
    public int PointMultiplier { get; set; }

    //[JsonPropertyName("statistics")]
    public Statistics Statistics { get; set; }
}
