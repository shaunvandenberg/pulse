dotnet publish -c Release -o out

docker build -t mock-rates-publisher .

docker tag mock-rates-publisher artifacts.bcp.absa.co.za/fx-trading-docker-local/mock-rates-publisher:1.0

docker login -u SVC-fxtrading-qa -p 9wLyvoZ7I6A1 artifacts.bcp.absa.co.za/fx-trading-docker-local

docker push artifacts.bcp.absa.co.za/fx-trading-docker-local/mock-rates-publisher:1.0