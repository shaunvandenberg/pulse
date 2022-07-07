namespace Rates.Publisher;

public class Rate
{
    public string ClientId { get; set; }

    public string RateId { get; set; }

    public string ValueDate { get; set; }

    public string Primary { get; set; }

    public string Secondary { get; set; }

    public string Tenor { get; set; }

    public IEnumerable<Tier> Tiers { get; set; }

    public string Token { get; set; }

    public int Status { get; set; }

    public long Timestamp { get; set; }

    public string Topic { get; set; }

    public decimal LiquidityLimitInBaseCcy { get; set; }

    public int PointMultiplier { get; set; }
}
