using Rates.Publisher;
using SolaceSystems.Solclient.Messaging;
using System.Diagnostics;
using System.Text;
using System.Text.Json;

// TODO: Perhaps use env variables to drive configuration...
const string Host = "wss://localhost:1443";
const string VPNName = "default";
const string Username = "client1.messaging.solace.cloud";
const string Password = "password123";
const string TrustStoreDir = "./Certs";
const int DefaultReconnectRetries = 3;
const string Topic = "fx-trading/rates";
const int Messages = 5000;

var cfp = new ContextFactoryProperties()
{
    SolClientLogLevel = SolLogLevel.Warning
};

cfp.LogToConsoleError();

ContextFactory.Instance.Init(cfp);

try
{
    using var context = ContextFactory.Instance.CreateContext(new ContextProperties(), null);

    var sessionProps = new SessionProperties
    {
        Host = Host,
        VPNName = VPNName,
        ReconnectRetries = DefaultReconnectRetries,
        GdWithWebTransport = true,
        AuthenticationScheme = AuthenticationSchemes.BASIC,
        SSLValidateCertificateHost = false,
        UserName = Username,
        Password = Password,
        SSLTrustStoreDir = TrustStoreDir
    };

    Console.WriteLine("Connecting to {0} on {1}...", VPNName, Host);

    using ISession session = context.CreateSession(sessionProps, null, null);

    var returnCode = session.Connect();

    if (returnCode == ReturnCode.SOLCLIENT_OK)
    {
        Console.WriteLine("Session successfully connected.");

        var currencyPairs = LoadConfig();

        var tasks = new List<Task>();

        var watch = new Stopwatch();

        watch.Start();

        foreach (var currencyPair in currencyPairs)
        {
            tasks.Add(Task.Run(() =>
            {
                PublishRates(currencyPair.Primary,
                    currencyPair.Secondary,
                    currencyPair.BidStart,
                    currencyPair.AskStart,
                    session);
            }));
        }

        Task.WaitAll(tasks.ToArray());

        watch.Stop();

        var totalMessages = (decimal)(currencyPairs.Count() * Messages);

        Console.WriteLine("Completed {0} messeage in {1} ms. {2} mps",
            totalMessages,
            watch.ElapsedMilliseconds,
            (totalMessages / watch.ElapsedMilliseconds) * 1000);
    }
    else
    {
        Console.WriteLine("Error connecting, return code: {0}", returnCode);
    }
}
catch (OperationErrorException ex)
{
    Console.WriteLine("Exception thrown: {0}", ex.ErrorInfo.ErrorStr);
}
catch (Exception ex)
{
    Console.WriteLine("Exception thrown: {0}", ex.Message);
}
finally
{
    ContextFactory.Instance.Cleanup();
}

static IEnumerable<CurrencyPairConfig> LoadConfig()
{
    var config = new List<CurrencyPairConfig>();

    config.Add(new CurrencyPairConfig("USD", "ZAR", 1.0001m, 1.0001m));
    config.Add(new CurrencyPairConfig("EUR", "ZAR", 10001.0001m, 10001.0001m));
    config.Add(new CurrencyPairConfig("EUR", "USD", 20001.0001m, 20001.0001m));
    config.Add(new CurrencyPairConfig("ZAR", "JPY", 30001.0001m, 30001.0001m));
    config.Add(new CurrencyPairConfig("GBP", "ZAR", 40001.0001m, 40001.0001m));

    return config;
}

static Rate CreateRate(string primary, string secondary, decimal bid, decimal ask, decimal spotBid, decimal spotAsk)
{
    return new Rate
    {
        ClientId = "728374356985065472",
        RateId = "",
        ValueDate = "2021-10-21 07:19:11.349",
        Primary = primary,
        Secondary = secondary,
        Tenor = "SP",
        Tiers = new List<Tier>
        {
            new Tier
            {
                FromAmount = 11380.62478m,
                Bid = bid,
                Ask = ask,
                SpotBid = spotBid,
                SpotAsk = spotAsk
            }
        },
        Token = Guid.NewGuid().ToString(),
        Status = 0,
    };
}

static void PublishRates(string primary, string secondary, decimal bidStart, decimal askStart, ISession session)
{
    var watch = new Stopwatch();

    watch.Start();

    var bid = bidStart;
    var ask = askStart;

    for (var i = 1; i <= Messages; i++)
    {
        var r = CreateRate(primary, secondary, bid, ask, bid, ask);

        PublishRate(session, r);

        bid += 1.0001m;
        ask += 1.0001m;
    }

    watch.Stop();

    Console.WriteLine("Published {0} messages in {1} ms.", Messages, watch.ElapsedMilliseconds);
}

static void PublishRate(ISession session, Rate rate)
{
    using IMessage message = ContextFactory.Instance.CreateMessage();

    message.Destination = ContextFactory.Instance.CreateTopic(Topic);
    message.BinaryAttachment = Encoding.ASCII.GetBytes(JsonSerializer.Serialize(rate, new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    }));
    message.DeliveryMode = MessageDeliveryMode.Direct;

    //Console.WriteLine("Publishing trade...");

    var returnCode = session.Send(message);

    if (returnCode == ReturnCode.SOLCLIENT_OK)
    {
        //Console.WriteLine("Done.");
    }
    else
    {
        Console.WriteLine("Publishing failed, return code: {0}", returnCode);
    }
}