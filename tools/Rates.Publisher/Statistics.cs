namespace Rates.Publisher
{
    public class Statistics
    {
        public long DispatcherTime { get; set; }

        public Statistics()
        {
            DispatcherTime = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        }
    }
}