using Rates.Publisher;
using SolaceSystems.Solclient.Messaging;
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
const int Messages = 1000;

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

        for (var i = 1; i <= Messages; i++)
        {
            var r = CreateRate(i, i, i, i);

            PublishRate(session, r);
        }

        Console.WriteLine("Published {0} messages.", Messages);
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

Console.WriteLine("Finished.");

static Rate CreateRate(decimal bid, decimal ask, decimal spotBid, decimal spotAsk)
{
    return new Rate
    {
      ClientId = "728374356985065472",
      RateId = "",
      ValueDate = "2021-10-21 07:19:11.349",
      Primary = "USD",
      Secondary = "ZAR",
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
      Token = "18825f05-7991-44ec-b352-1e45dce342ec",
      Status = 0,
    };
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