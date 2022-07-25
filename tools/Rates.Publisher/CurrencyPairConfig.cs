namespace Rates.Publisher
{
    public class CurrencyPairConfig
    {
        public string Primary { get; set; }

        public string Secondary { get; set; }

        public decimal BidStart { get; set; }

        public decimal AskStart { get; set; }

        public CurrencyPairConfig(string primary, string secondary, decimal bidStart, decimal askStart)
        {
            this.Primary = primary;
            this.Secondary = secondary;
            this.BidStart = bidStart;
            this.AskStart = askStart;
        }
    }
}
